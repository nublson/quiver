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

const SESSION_TOKEN = 'sess_abc'
const GITHUB_TOKEN = 'ghp_tok'
const USERNAME = 'testuser'

/** A device code fetch response with interval:0 so polling is immediate. */
function deviceCodeBody() {
  return {
    device_code: 'dev123',
    expires_in: 300,
    interval: 0,
    user_code: 'USR1CODE',
    verification_uri: 'http://api.test/device',
    verification_uri_complete: 'http://api.test/device?user_code=USR1CODE',
  }
}

function tokenBody(token: string) {
  return {access_token: token}
}

function githubTokenBody() {
  return {githubToken: GITHUB_TOKEN, username: USERNAME}
}

function makeFetchMock(...responses: {body: unknown; ok: boolean; status: number}[]) {
  let call = 0
  return vi.fn().mockImplementation(() => {
    const r = responses[Math.min(call++, responses.length - 1)]
    return Promise.resolve({
      json: () => Promise.resolve(r.body),
      ok: r.ok,
      status: r.status,
      text: () => Promise.resolve(JSON.stringify(r.body)),
    })
  })
}

function ok(body: unknown) {
  return {body, ok: true, status: 200}
}

function err(status: number, body: unknown = {}) {
  return {body, ok: false, status}
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
    vi.stubGlobal('fetch', makeFetchMock(ok(deviceCodeBody()), ok(tokenBody(SESSION_TOKEN)), ok(githubTokenBody())))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({
      githubToken: GITHUB_TOKEN,
      token: SESSION_TOKEN,
      username: USERNAME,
    })
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(`@${USERNAME}`))
  })

  it('shows re-auth message when already logged in', async () => {
    credMocks.readCredentials.mockResolvedValue({githubToken: 'g', token: 'old', username: 'prev'})
    vi.stubGlobal('fetch', makeFetchMock(ok(deviceCodeBody()), ok(tokenBody(SESSION_TOKEN)), ok(githubTokenBody())))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('re-authenticate'))
    expect(credMocks.writeCredentials).toHaveBeenCalled()
  })

  it('errors when device code request fails', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal('fetch', makeFetchMock(err(500, 'Server error')))

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('500'))
  })

  it('errors when poll returns access_denied', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal('fetch', makeFetchMock(ok(deviceCodeBody()), ok({error: 'access_denied'})))

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('denied'))
  })

  it('errors when poll returns expired_token', async () => {
    credMocks.readCredentials.mockResolvedValue(null)
    vi.stubGlobal('fetch', makeFetchMock(ok(deviceCodeBody()), ok({error: 'expired_token'})))

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
          ok(deviceCodeBody()),
          ok({error: 'slow_down'}),
          ok(tokenBody(SESSION_TOKEN)),
          ok(githubTokenBody()),
        ),
      )

      const {cmd} = makeCmd()
      const runPromise = cmd.run()
      // advance past the 5s interval added by slow_down
      await vi.runAllTimersAsync()
      await runPromise

      expect(credMocks.writeCredentials).toHaveBeenCalledWith(expect.objectContaining({token: SESSION_TOKEN}))
    } finally {
      vi.useRealTimers()
    }
  })
})
