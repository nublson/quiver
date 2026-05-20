import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const credMocks = vi.hoisted(() => ({
  readCredentials: vi.fn(),
  writeCredentials: vi.fn().mockResolvedValue(),
}))

const lockMocks = vi.hoisted(() => ({
  readLockFileIfExists: vi.fn(),
}))

const gistMocks = vi.hoisted(() => ({
  findOrCreateGist: vi.fn(),
  readGist: vi.fn(),
}))

vi.mock('../../src/lib/credentials.js', () => ({
  readCredentials: credMocks.readCredentials,
  writeCredentials: credMocks.writeCredentials,
}))

vi.mock('../../src/lib/lock-file.js', () => ({
  readLockFileIfExists: lockMocks.readLockFileIfExists,
}))

vi.mock('../../src/lib/gist.js', () => ({
  findOrCreateGist: gistMocks.findOrCreateGist,
  readGist: gistMocks.readGist,
}))

const {default: Status} = await import('../../src/commands/status.js')

const GIST_ID = 'gist123'
const GITHUB_TOKEN = 'ghp_tok'
const SESSION_TOKEN = 'sess_abc'

const credentials = {
  gistId: GIST_ID,
  githubToken: GITHUB_TOKEN,
  token: SESSION_TOKEN,
  username: 'testuser',
}

function makeSkillEntry(name: string) {
  return {
    installedAt: '2026-01-01T00:00:00Z',
    skillFolderHash: 'abc',
    skillPath: `skills/${name}/SKILL.md`,
    source: 'anthropics/skills',
    sourceType: 'github',
    sourceUrl: 'https://github.com/anthropics/skills.git',
    updatedAt: '2026-01-01T00:00:00Z',
  }
}

function makeLock(skillNames: string[]) {
  return {
    dismissed: {},
    lastSelectedAgents: [],
    skills: Object.fromEntries(skillNames.map((n) => [n, makeSkillEntry(n)])),
    version: 3,
  }
}

function makeCmd() {
  const cmd = new Status([], {} as Parameters<typeof Status>[1])
  const logSpy = vi.spyOn(cmd, 'log').mockImplementation(() => {})
  const errorSpy = vi.spyOn(cmd, 'error').mockImplementation((msg: unknown) => {
    throw new Error(String(msg))
  })
  return {cmd, errorSpy, logSpy}
}

describe('status command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('errors when not logged in', async () => {
    credMocks.readCredentials.mockResolvedValue(null)

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith('Run `quiver login` first.')
  })

  it('errors when githubToken is missing', async () => {
    credMocks.readCredentials.mockResolvedValue({token: SESSION_TOKEN, username: 'testuser'})

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith('Run `quiver login` first.')
  })

  it('errors when session token is missing', async () => {
    credMocks.readCredentials.mockResolvedValue({githubToken: GITHUB_TOKEN, username: 'testuser'})

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith('Run `quiver login` first.')
  })

  it('persists gistId when findOrCreateGist returns a new one', async () => {
    const newGistId = 'gist456'
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(newGistId)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design']))

    const {cmd} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({...credentials, gistId: newGistId})
  })

  it('does not update credentials when gistId is unchanged', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design']))

    const {cmd} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).not.toHaveBeenCalled()
  })

  it('prints "no skills found" when both local and remote are empty', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock([]))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock([]))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  No skills found locally or remotely.')
  })

  it('treats null local lock as empty', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['data-analysis']))
    lockMocks.readLockFileIfExists.mockResolvedValue(null)

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  local only:   (none)')
    expect(logSpy).toHaveBeenCalledWith('  remote only:  data-analysis')
    expect(logSpy).toHaveBeenCalledWith('  in sync:      (none)')
  })

  it('shows local-only skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock([]))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['pdf-reading']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  local only:   pdf-reading')
    expect(logSpy).toHaveBeenCalledWith('  remote only:  (none)')
    expect(logSpy).toHaveBeenCalledWith('  in sync:      (none)')
  })

  it('shows remote-only skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['data-analysis']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock([]))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  local only:   (none)')
    expect(logSpy).toHaveBeenCalledWith('  remote only:  data-analysis')
    expect(logSpy).toHaveBeenCalledWith('  in sync:      (none)')
  })

  it('shows all in-sync skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design', 'docx']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design', 'docx']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  local only:   (none)')
    expect(logSpy).toHaveBeenCalledWith('  remote only:  (none)')
    expect(logSpy).toHaveBeenCalledWith('  in sync:      docx, frontend-design')
  })

  it('shows mixed diff across all three categories', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design', 'data-analysis']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design', 'pdf-reading']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  local only:   pdf-reading')
    expect(logSpy).toHaveBeenCalledWith('  remote only:  data-analysis')
    expect(logSpy).toHaveBeenCalledWith('  in sync:      frontend-design')
  })

  it('sorts skills alphabetically within each category', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['zebra', 'apple', 'mango']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock([]))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith('  remote only:  apple, mango, zebra')
  })
})
