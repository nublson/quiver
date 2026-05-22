import {Args, Command} from '@oclif/core'
import {Listr} from 'listr2'
import {rm} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, writeGist} from '../lib/gist.js'
import {readLockFile, writeLockFile} from '../lib/lock-file.js'

export default class Remove extends Command {
  static args = {
    skillName: Args.string({description: 'Skill name to remove', required: true}),
  }
  static description = 'Remove a global skill and sync the removal to GitHub Gist'
  static examples = ['<%= config.bin %> remove frontend-design']

  async run(): Promise<void> {
    const {args} = await this.parse(Remove)
    const {skillName} = args

    const creds = await readCredentials()
    if (!creds?.githubToken) {
      this.error('Run `quiver login` first.')
    }

    const lock = await readLockFile()
    const entry = lock.skills?.[skillName]
    if (!entry) {
      this.error(`Skill "${skillName}" not found in lock file.`)
    }

    const tasks = new Listr(
      [
        {
          async task(_, wrapper) {
            const skillDir = join(homedir(), '.agents', dirname(entry.skillPath))
            await rm(skillDir, {force: true, recursive: true})
            wrapper.title = `removed ${skillName}`
          },
          title: `removing ${skillName}`,
        },
        {
          async task(_, wrapper) {
            delete lock.skills[skillName]
            await writeLockFile(lock)
            wrapper.title = 'lock file updated'
          },
          title: 'updating lock file',
        },
        {
          async task(_, wrapper) {
            const gistId = await findOrCreateGist(creds.githubToken)
            if (creds.gistId !== gistId) {
              await writeCredentials({...creds, gistId})
            }

            await writeGist(gistId, lock, creds.githubToken)
            wrapper.title = `pushed to gist · @${creds.username}`
          },
          title: `pushing to gist · @${creds.username}`,
        },
      ],
      {concurrent: false},
    )

    try {
      await tasks.run()
    } catch (error) {
      const cause = (error as {errors?: Error[]}).errors?.[0] ?? error
      throw cause
    }

    this.log(`removed ${skillName}`)
  }
}
