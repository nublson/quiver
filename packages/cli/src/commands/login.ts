/* eslint-disable n/no-unsupported-features/node-builtins */
/* eslint-disable camelcase -- OAuth device flow (RFC 8628) uses snake_case in JSON */
import {Command} from '@oclif/core'
import open from 'open'

import {API_BASE} from '../lib/config.js'
import {readCredentials, writeCredentials} from '../lib/credentials.js'

type DeviceCodeResponse = {
  device_code: string
  expires_in: number
  interval: number
  user_code: string
  verification_uri: string
  verification_uri_complete?: string
}

type TokenResponse =
  | {access_token: string}
  | {
      error: 'access_denied' | 'authorization_pending' | 'expired_token' | 'slow_down'
      error_description?: string
    }

export default class Login extends Command {
  static description = 'Authenticate with GitHub'
  static examples = ['<%= config.bin %> login']

  async run(): Promise<void> {
    const existing = await readCredentials()
    if (existing) {
      this.log(`Already logged in as @${existing.username}. Continuing to re-authenticate.`)
    }

    const codeRes = await fetch(`${API_BASE}/auth/device/code`, {
      body: JSON.stringify({client_id: 'quiver-cli'}),
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
    })
    if (!codeRes.ok) {
      this.error(`Failed to start login: ${codeRes.status} ${await codeRes.text()}`)
    }

    const {
      device_code,
      interval = 5,
      user_code,
      verification_uri,
      verification_uri_complete,
    } = (await codeRes.json()) as DeviceCodeResponse

    const openUrl = verification_uri_complete ?? `${verification_uri}?user_code=${user_code}`

    this.log(`\nOpen this URL to authorize quiver:\n  ${openUrl}`)
    this.log(`\nOr visit ${verification_uri} and enter code: ${user_code}\n`)
    await open(openUrl).catch(() => {
      // Silently fail — headless environments can't open a browser
    })

    this.log('Waiting for authorization in the browser...')
    const sessionToken = await this.pollForToken(device_code, interval * 1000)

    const tokenRes = await fetch(`${API_BASE}/cli/github-token`, {
      headers: {Authorization: `Bearer ${sessionToken}`},
    })
    if (!tokenRes.ok) {
      this.error(`Failed to retrieve GitHub token: ${tokenRes.status}`)
    }

    const {githubToken, username} = (await tokenRes.json()) as {
      githubToken: string
      username: string
    }

    await writeCredentials({githubToken, token: sessionToken, username})
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

      const res = await fetch(`${API_BASE}/auth/device/token`, {
        body: JSON.stringify({
          client_id: 'quiver-cli',
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
      })

      const data = (await res.json()) as TokenResponse

      if ('access_token' in data) return data.access_token

      let nextInterval = currentInterval
      if (data.error === 'slow_down') nextInterval += 5000

      if (data.error === 'access_denied') {
        this.error('Authorization was denied. Run quiver login to try again.')
      }

      if (data.error === 'expired_token') {
        this.error('Device code expired. Run quiver login to try again.')
      }

      return attempt(nextInterval)
    }

    return attempt(intervalMs)
  }
}
