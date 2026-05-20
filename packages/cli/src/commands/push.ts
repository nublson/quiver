import {Command} from '@oclif/core'

import type {SkillLockFile} from '../lib/types.js'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, writeGist} from '../lib/gist.js'
import {readLockFile} from '../lib/lock-file.js'

export default class Push extends Command {
  static description = 'Upload your local skill lock to GitHub Gist'
  static examples = ['<%= config.bin %> push']

  async run(): Promise<void> {
    const creds = await readCredentials()
    if (!creds?.githubToken || !creds.token) {
      this.error('Run `quiver login` first.')
    }

    let lockData: SkillLockFile
    try {
      lockData = await readLockFile()
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.includes('No global skills found')) this.error(msg)
      throw error
    }

    const gistId = await findOrCreateGist(creds.githubToken)

    if (creds.gistId !== gistId) {
      await writeCredentials({...creds, gistId})
    }

    await writeGist(gistId, lockData, creds.githubToken)

    const count = Object.keys(lockData.skills ?? {}).length
    this.log(`Pushed ${count} skill${count === 1 ? '' : 's'} • ${new Date().toISOString()}`)
  }
}
