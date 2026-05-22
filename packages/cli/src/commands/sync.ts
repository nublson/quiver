import {Command} from '@oclif/core'
import {Listr} from 'listr2'
import {spawn} from 'node:child_process'

import type {SkillEntry} from '../lib/types.js'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, readGist} from '../lib/gist.js'
import {readLockFileIfExists, writeLockFile} from '../lib/lock-file.js'

function runSkillsAdd(sourceUrl: string, skillNames: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const skillFlags = skillNames.flatMap((name) => ['--skill', name])
    const child = spawn(
      'npx',
      ['skills', 'add', sourceUrl, ...skillFlags, '-g', '-y'],
      {
        shell: process.platform === 'win32',
        stdio: 'pipe',
      },
    )

    let output = ''
    child.stdout?.on('data', (chunk: Buffer) => {
      output += chunk.toString()
    })
    child.stderr?.on('data', (chunk: Buffer) => {
      output += chunk.toString()
    })

    child.on('error', reject)
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      const msg = signal
        ? `npx skills add exited with signal ${signal}`
        : `npx skills add exited with code ${code}`
      reject(Object.assign(new Error(msg), {output}))
    })
  })
}

export default class Sync extends Command {
  static description = 'Install missing global skills from your GitHub Gist lock'
  static examples = ['<%= config.bin %> sync']

  async run(): Promise<void> {
    const creds = await readCredentials()
    if (!creds?.githubToken) {
      this.error('Run `quiver login` first.')
    }

    const gistId = await findOrCreateGist(creds.githubToken)

    if (creds.gistId !== gistId) {
      await writeCredentials({...creds, gistId})
    }

    const remoteLock = await readGist(gistId, creds.githubToken)

    const localLock =
      (await readLockFileIfExists()) ?? {
        dismissed: {},
        lastSelectedAgents: [],
        skills: {},
        version: 3,
      }

    const remoteSkills = remoteLock.skills ?? {}
    const localKeys = new Set(Object.keys(localLock.skills ?? {}))

    const missingNames = Object.keys(remoteSkills).filter((name) => !localKeys.has(name))

    const groups = new Map<string, string[]>()
    for (const name of missingNames) {
      const entry = remoteSkills[name] as SkillEntry | undefined
      if (!entry?.sourceUrl || !entry.skillPath) {
        throw new Error(`Remote lock entry for "${name}" is missing sourceUrl or skillPath.`)
      }

      const bucket = groups.get(entry.sourceUrl) ?? []
      bucket.push(name)
      groups.set(entry.sourceUrl, bucket)
    }

    const succeededUrls = new Set<string>()
    const failures: Array<{label: string; output: string; sourceUrl: string}> = []

    const tasks = new Listr(
      [...groups.entries()].map(([sourceUrl, skillNames]) => {
        const label = (remoteSkills[skillNames[0]!] as SkillEntry).source
        const skillWord = skillNames.length === 1 ? 'skill' : 'skills'
        return {
          async task(_: unknown, wrapper: {title: string}) {
            const start = Date.now()
            try {
              await runSkillsAdd(sourceUrl, skillNames)
              const elapsed = ((Date.now() - start) / 1000).toFixed(1)
              wrapper.title = `${label} (${skillNames.length} ${skillWord}, ${elapsed}s)`
              succeededUrls.add(sourceUrl)
            } catch (error) {
              const output = (error as {output?: string}).output ?? String(error)
              failures.push({label, output, sourceUrl})
              throw error
            }
          },
          title: `${label} (${skillNames.length} ${skillWord})`,
        }
      }),
      {concurrent: true, exitOnError: false},
    )

    try {
      await tasks.run()
    } catch {
      // failures already collected above; handled below
    }

    const succeededNames = missingNames.filter(
      (name) => succeededUrls.has((remoteSkills[name] as SkillEntry).sourceUrl),
    )

    if (succeededNames.length > 0) {
      const currentLock = (await readLockFileIfExists()) ?? localLock
      const updatedSkills = {...currentLock.skills}
      for (const name of succeededNames) {
        updatedSkills[name] = remoteSkills[name] as SkillEntry
      }

      await writeLockFile({...currentLock, skills: updatedSkills})
    }

    const added = succeededNames.length
    const upToDate = Object.keys(remoteSkills).length - missingNames.length
    this.log(`${added} skill${added === 1 ? '' : 's'} added, ${upToDate} already up to date`)

    if (failures.length > 0) {
      for (const {label, output} of failures) {
        this.log(`\nFailed to install from ${label}:`)
        if (output) this.log(output.trim())
      }

      this.error(`${failures.length} source${failures.length === 1 ? '' : 's'} failed to install`)
    }
  }
}
