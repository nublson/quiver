/* eslint-disable camelcase -- OAuth device flow (RFC 8628) uses snake_case in JSON */
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const credMocks = vi.hoisted(() => ({
  readCredentials: vi.fn(),
  writeCredentials: vi.fn().mockResolvedValue(),
}))

vi.mock('../../src/lib/credentials.js', () => ({
  readCredentials: credMocks.readCredentials,
  writeCredentials: credMocks.writeCredentials,
}))

vi.mock('open', () => ({default: vi.fn().mockResolvedValue()}))

const {default: Login} = await import('../../src/commands/login.js')

const GITHUB_TOKEN = 'ghp_tok'
const USERNAME = 'testuser'

/** URL-encoded device code response from GitHub (interval:0 so polling is immediate). */
function deviceCodeText() {
  return new URLSearchParams({
    device_code: 'dev123',
    expires_in: '300',
    interval: '0',
    user_code: 'USR1CODE',
    verification_uri: 'https://github.com/login/device',
    verification_uri_complete: 'https://github.com/login/device?user_code=USR1CODE',
  }).toString()
}

/** URL-encoded successful token response from GitHub. */
function tokenText() {
  return new URLSearchParams({access_token: GITHUB_TOKEN}).toString()
}

/** URL-encoded error responses from GitHub. */
function errorText(code: string) {
  return new URLSearchParams({error: code}).toString()
}

/** GitHub API user response (JSON). */
function githubUserBody() {
  return {login: USERNAME}
}

type MockResponse = {body?: unknown; ok: boolean; status: number; text?: string;}

function makeFetchMock(...responses: MockResponse[]) {
  let call = 0
  return vi.fn().mockImplementation(() => {
    const r = responses[Math.min(call++, responses.length - 1)]
    return Promise.resolve({
      json: () => Promise.resolve(r.body ?? {}),
      ok: r.ok,
      status: r.status,
      text: () => Promise.resolve(r.text ?? JSON.stringify(r.body ?? {})),
    })
  })
}

function okText(text: string): MockResponse {
  return {ok: true, status: 200, text}
}

function okJson(body: unknown): MockResponse {
  return {body, ok: true, status: 200}
}

function errText(status: number, text = ''): MockResponse {
  return {ok: false, status, text}
}

/** Creates a command instance with log and error spied on. */
function makeCmd() {
  const cmd = new Login([], {} as Parameters<typeof Login>[1])
  const logSpy = vi.spyOn(cmd, 'log').mockImplementation(() => {})
  const errorSpy = vi.spyOn(cmd, 'error').mockImplementation((msg: unknown) => {
    throw new Error(String(msg))
  })
  return {cmd, errorSpy, logSpy}
}

describe('login command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('full happy path — writes credentials and logs username', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal(
      'fetch',
      makeFetchMock(
        okText(deviceCodeText()),   // POST github.com/login/device/code
        okText(tokenText()),        // POST github.com/login/oauth/access_token
        okJson(githubUserBody()),   // GET api.github.com/user
      ),
    )

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({
      githubToken: GITHUB_TOKEN,
      username: USERNAME,
    })
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`@${USERNAME}`))
  })

  it('shows re-auth message when already logged in', async () => {
    credMocks.readCredentials.mockResolvedValue({githubToken: 'g', username: 'prev'})
    vi.stubGlobal(
      'fetch',
      makeFetchMock(
        okText(deviceCodeText()),
        okText(tokenText()),
        okJson(githubUserBody()),
      ),
    )

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('re-authenticate'))
    expect(credMocks.writeCredentials).toHaveBeenCalled()
  })

  it('errors when device code request fails', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal('fetch', makeFetchMock(errText(500, 'Server error')))

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('500'))
  })

  it('errors when poll returns access_denied', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal(
      'fetch',
      makeFetchMock(okText(deviceCodeText()), okText(errorText('access_denied'))),
    )

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('denied'))
  })

  it('errors when poll returns expired_token', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal(
      'fetch',
      makeFetchMock(okText(deviceCodeText()), okText(errorText('expired_token'))),
    )

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('expired'))
  })

  it('retries after slow_down and succeeds', async () => {
    vi.useFakeTimers()
    try {
      credMocks.readCredentials.mockResolvedValue(null)
      vi.stubGlobal(
        'fetch',
        makeFetchMock(
          okText(deviceCodeText()),          // device/code
          okText(errorText('slow_down')),    // first poll → slow down
          okText(tokenText()),               // second poll → success
          okJson(githubUserBody()),          // GET /user
        ),
      )

      const {cmd} = makeCmd()
      const runPromise = cmd.run()
      await vi.runAllTimersAsync()
      await runPromise

      expect(credMocks.writeCredentials).toHaveBeenCalledWith(
        expect.objectContaining({githubToken: GITHUB_TOKEN}),
      )
    } finally {
      vi.useRealTimers()
    }
  })
})
