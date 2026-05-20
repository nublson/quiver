import {Args, Command} from '@oclif/core'
import {spawn} from 'node:child_process'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, writeGist} from '../lib/gist.js'
import {readLockFile, writeLockFile} from '../lib/lock-file.js'

export function runSkillsRm(skillPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['skills', 'rm', skillPath],
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
            ? `npx skills rm exited with signal ${signal}`
            : `npx skills rm exited with code ${code}`,
        ),
      )
    })
  })
}

export default class Remove extends Command {
  static args = {
    name: Args.string({description: 'Skill name to remove', required: true}),
  }
  static description = 'Remove a global skill and sync the removal to GitHub Gist'
  static examples = ['<%= config.bin %> remove frontend-design']

  async run(): Promise<void> {
    const {args} = await this.parse(Remove)
    const skillName = args.name

    const creds = await readCredentials()
    if (!creds?.githubToken || !creds.token) {
      this.error('Run `quiver login` first.')
    }

    const lock = await readLockFile()

    const entry = lock.skills?.[skillName]
    if (!entry) {
      this.error(`Skill "${skillName}" not found in lock file.`)
    }

    await runSkillsRm(entry.skillPath)

    delete lock.skills[skillName]
    await writeLockFile(lock)

    const gistId = await findOrCreateGist(creds.githubToken)
    if (creds.gistId !== gistId) {
      await writeCredentials({...creds, gistId})
    }

    await writeGist(gistId, lock, creds.githubToken)

    this.log(`Removed ${skillName} and pushed updated lock`)
  }
}
