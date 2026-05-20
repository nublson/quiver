import {Command} from '@oclif/core'
import {spawn} from 'node:child_process'

import type {SkillEntry} from '../lib/types.js'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, readGist} from '../lib/gist.js'
import {readLockFileIfExists} from '../lib/lock-file.js'

/** Derive CLI `--skill` name from lock `skillPath` (e.g. skills/foo/SKILL.md → foo). */
export function skillNameFromSkillPath(skillPath: string): string {
  const segments = skillPath.split('/').filter(Boolean)
  const folder = segments.at(-2)
  if (!folder) {
    throw new Error(`Invalid skillPath in lock file: ${skillPath}`)
  }

  return folder
}

function runSkillsAdd(sourceUrl: string, skillName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['skills', 'add', sourceUrl, '--skill', skillName, '-g', '-y'],
      {
        shell: process.platform === 'win32',
        stdio: 'inherit',
      },
    )
    child.on('error', reject)
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          signal
            ? `npx skills add exited with signal ${signal}`
            : `npx skills add exited with code ${code}`,
        ),
      )
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

    let added = 0
    const installAt = async (index: number): Promise<void> => {
      if (index >= missingNames.length) return
      const name = missingNames[index]!
      const entry = remoteSkills[name] as SkillEntry | undefined
      if (!entry?.sourceUrl || !entry.skillPath) {
        throw new Error(`Remote lock entry for "${name}" is missing sourceUrl or skillPath.`)
      }

      const skillName = skillNameFromSkillPath(entry.skillPath)
      await runSkillsAdd(entry.sourceUrl, skillName)
      added++
      await installAt(index + 1)
    }

    await installAt(0)

    const upToDate = Object.keys(remoteSkills).length - missingNames.length
    this.log(
      `${added} skill${added === 1 ? '' : 's'} added, ${upToDate} already up to date`,
    )
  }
}
