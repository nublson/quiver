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

function makeSkillEntry(name: string, source = 'anthropics/skills') {
  return {
    installedAt: '2026-01-01T00:00:00Z',
    skillFolderHash: 'abc',
    skillPath: `skills/${name}/SKILL.md`,
    source,
    sourceType: 'github',
    sourceUrl: 'https://github.com/anthropics/skills.git',
    updatedAt: '2026-01-01T00:00:00Z',
  }
}

function makeLock(skillNames: string[], source?: string) {
  return {
    dismissed: {},
    lastSelectedAgents: [],
    skills: Object.fromEntries(skillNames.map((n) => [n, makeSkillEntry(n, source)])),
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

function loggedLines(logSpy: ReturnType<typeof vi.spyOn>) {
  return logSpy.mock.calls.map((c) => String(c[0]))
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

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('local only') && l.includes('(0)'))).toBe(true)
    expect(lines.some((l) => l.includes('remote only') && l.includes('(1)'))).toBe(true)
    expect(lines.some((l) => l.includes('in sync') && l.includes('(0)'))).toBe(true)
    expect(lines.some((l) => l.includes('data-analysis'))).toBe(true)
  })

  it('shows local-only skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock([]))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['pdf-reading']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('local only') && l.includes('(1)'))).toBe(true)
    expect(lines.some((l) => l.includes('remote only') && l.includes('(0)'))).toBe(true)
    expect(lines.some((l) => l.includes('in sync') && l.includes('(0)'))).toBe(true)
    expect(lines.some((l) => l.includes('pdf-reading'))).toBe(true)
  })

  it('shows remote-only skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['data-analysis']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock([]))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('remote only') && l.includes('(1)'))).toBe(true)
    expect(lines.some((l) => l.includes('data-analysis'))).toBe(true)
    expect(lines.some((l) => l.includes('→ run quiver sync to install'))).toBe(true)
  })

  it('shows action hint for local-only when non-empty', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock([]))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['pdf-reading']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('→ run quiver push to upload'))).toBe(true)
  })

  it('shows source repo next to remote-only skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['data-analysis'], 'vercel-labs/skills'))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock([]))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('data-analysis') && l.includes('vercel-labs/skills'))).toBe(true)
  })

  it('shows source repo next to in-sync skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design'], 'anthropics/skills'))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design'], 'anthropics/skills'))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('frontend-design') && l.includes('anthropics/skills'))).toBe(true)
  })

  it('shows all in-sync skills each on their own line', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design', 'docx']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design', 'docx']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('in sync') && l.includes('(2)'))).toBe(true)
    expect(lines.filter((l) => l.includes('docx')).length).toBeGreaterThanOrEqual(1)
    expect(lines.filter((l) => l.includes('frontend-design')).length).toBeGreaterThanOrEqual(1)
  })

  it('shows mixed diff across all three categories', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design', 'data-analysis']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design', 'pdf-reading']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('local only') && l.includes('(1)'))).toBe(true)
    expect(lines.some((l) => l.includes('remote only') && l.includes('(1)'))).toBe(true)
    expect(lines.some((l) => l.includes('in sync') && l.includes('(1)'))).toBe(true)
    expect(lines.some((l) => l.includes('pdf-reading'))).toBe(true)
    expect(lines.some((l) => l.includes('data-analysis'))).toBe(true)
    expect(lines.some((l) => l.includes('frontend-design'))).toBe(true)
  })

  it('sorts skills alphabetically within each category', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['zebra', 'apple', 'mango']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock([]))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    const appleIdx = lines.findIndex((l) => l.includes('apple'))
    const mangoIdx = lines.findIndex((l) => l.includes('mango'))
    const zebraIdx = lines.findIndex((l) => l.includes('zebra'))
    expect(appleIdx).toBeLessThan(mangoIdx)
    expect(mangoIdx).toBeLessThan(zebraIdx)
  })

  it('includes username and gist context in the header', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(makeLock(['frontend-design']))
    lockMocks.readLockFileIfExists.mockResolvedValue(makeLock(['frontend-design']))

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    const lines = loggedLines(logSpy)
    expect(lines.some((l) => l.includes('testuser') && l.includes('gist'))).toBe(true)
  })
})
