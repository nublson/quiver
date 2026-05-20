import {Command} from '@oclif/core'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, readGist} from '../lib/gist.js'
import {readLockFileIfExists} from '../lib/lock-file.js'

export default class Status extends Command {
  static description = 'Show a diff between your local and remote skill lock'
  static examples = ['<%= config.bin %> status']

  async run(): Promise<void> {
    const creds = await readCredentials()
    if (!creds?.githubToken) {
      this.error('Run `quiver login` first.')
    }

    const gistId = await findOrCreateGist(creds.githubToken)

    if (creds.gistId !== gistId) {
      await writeCredentials({...creds, gistId})
    }

    const remote = await readGist(gistId, creds.githubToken)
    const local = (await readLockFileIfExists()) ?? {skills: {}}

    const remoteKeys = new Set(Object.keys(remote.skills))
    const localKeys = new Set(Object.keys(local.skills))

    const localOnly = [...localKeys].filter((k) => !remoteKeys.has(k)).sort()
    const remoteOnly = [...remoteKeys].filter((k) => !localKeys.has(k)).sort()
    const inSync = [...localKeys].filter((k) => remoteKeys.has(k)).sort()

    if (localOnly.length === 0 && remoteOnly.length === 0 && inSync.length === 0) {
      this.log('  No skills found locally or remotely.')
      return
    }

    this.log(`  local only:   ${localOnly.length > 0 ? localOnly.join(', ') : '(none)'}`)
    this.log(`  remote only:  ${remoteOnly.length > 0 ? remoteOnly.join(', ') : '(none)'}`)
    this.log(`  in sync:      ${inSync.length > 0 ? inSync.join(', ') : '(none)'}`)
  }
}
