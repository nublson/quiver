/* eslint-disable n/no-unsupported-features/node-builtins */
/* eslint-disable camelcase -- OAuth device flow (RFC 8628) uses snake_case in JSON */
import {Command} from '@oclif/core'
import open from 'open'

import {GITHUB_CLIENT_ID, GITHUB_DEVICE_CODE_URL, GITHUB_TOKEN_URL} from '../lib/config.js'
import {readCredentials, writeCredentials} from '../lib/credentials.js'

export default class Login extends Command {
  static description = 'Authenticate with GitHub'
  static examples = ['<%= config.bin %> login']

  async run(): Promise<void> {
    const existing = await readCredentials()
    if (existing) {
      this.log(`Already logged in as @${existing.username}. Continuing to re-authenticate.`)
    }

    // Step 1 — request a device code from GitHub
    const codeRes = await fetch(GITHUB_DEVICE_CODE_URL, {
      body: new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        scope: 'gist read:user',
      }),
      headers: {'Accept': 'application/x-www-form-urlencoded'},
      method: 'POST',
    })
    if (!codeRes.ok) {
      this.error(`Failed to start login: ${codeRes.status} ${await codeRes.text()}`)
    }

    const codeParams = new URLSearchParams(await codeRes.text())
    const device_code = codeParams.get('device_code')
    const user_code = codeParams.get('user_code')
    const verification_uri = codeParams.get('verification_uri') ?? 'https://github.com/login/device'
    const verification_uri_complete = codeParams.get('verification_uri_complete')
    const interval = Number(codeParams.get('interval') ?? 5)

    if (!device_code || !user_code) {
      this.error('GitHub did not return a device code. Check that your OAuth App has "Device authorization" enabled.')
    }

    const openUrl = verification_uri_complete ?? `${verification_uri}?user_code=${user_code}`

    this.log(`\nOpen this URL to authorize quiver:\n  ${openUrl}`)
    this.log(`\nOr visit ${verification_uri} and enter code: ${user_code}\n`)
    await open(openUrl).catch(() => {
      // Silently fail — headless environments can't open a browser
    })

    // Step 2 — poll until the user approves
    this.log('Waiting for authorization in the browser...')
    const githubToken = await this.pollForToken(device_code, interval * 1000)

    // Step 3 — fetch the GitHub username
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'User-Agent': 'quiver-cli',
      },
    })
    if (!userRes.ok) {
      this.error(`Failed to fetch GitHub user info: ${userRes.status}`)
    }

    const {login: username} = (await userRes.json()) as {login: string}

    await writeCredentials({githubToken, username})
    this.log(`\nLogged in as @${username}`)
  }

  private async pollForToken(deviceCode: string, intervalMs: number): Promise<string> {
    const deadline = Date.now() + 10 * 60 * 1000

    const attempt = async (currentInterval: number): Promise<string> => {
      if (Date.now() >= deadline) {
        this.error('Login timed out. Run quiver login to try again.')
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, currentInterval)
      })

      const res = await fetch(GITHUB_TOKEN_URL, {
        body: new URLSearchParams({
          client_id: GITHUB_CLIENT_ID,
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
        headers: {'Accept': 'application/x-www-form-urlencoded'},
        method: 'POST',
      })

      const params = new URLSearchParams(await res.text())
      const accessToken = params.get('access_token')
      const error = params.get('error')

      if (accessToken) return accessToken

      if (error === 'slow_down') return attempt(currentInterval + 5000)
      if (error === 'access_denied') this.error('Authorization was denied. Run quiver login to try again.')
      if (error === 'expired_token') this.error('Device code expired. Run quiver login to try again.')

      // authorization_pending or unknown — keep polling
      return attempt(currentInterval)
    }

    return attempt(intervalMs)
  }
}
