import {Command} from '@oclif/core'

import {readCredentials} from '../lib/credentials.js'
import {dim, green} from '../lib/ui.js'

export default class Whoami extends Command {
  static description = 'Show the currently authenticated GitHub user'
  static examples = ['<%= config.bin %> whoami']

  async run(): Promise<void> {
    const creds = await readCredentials()

    if (!creds?.githubToken) {
      this.log(`  Not logged in. Run ${dim('quiver login')} to authenticate.`)
      return
    }

    this.log('')
    this.log(`  ${green('✔')} logged in as @${creds.username}`)
    if (creds.gistId) {
      this.log(`  ${dim('gist')}  ${dim(creds.gistId)}`)
    } else {
      this.log(`  ${dim('gist')}  ${dim('(none yet — run quiver push)')}`)
    }

    this.log('')
  }
}
