import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const credMocks = vi.hoisted(() => ({
  readCredentials: vi.fn(),
  writeCredentials: vi.fn().mockResolvedValue(),
}))

const lockMocks = vi.hoisted(() => ({
  readLockFile: vi.fn(),
}))

const gistMocks = vi.hoisted(() => ({
  findOrCreateGist: vi.fn(),
  writeGist: vi.fn().mockResolvedValue(),
}))

vi.mock('../../src/lib/credentials.js', () => ({
  readCredentials: credMocks.readCredentials,
  writeCredentials: credMocks.writeCredentials,
}))

vi.mock('../../src/lib/lock-file.js', () => ({
  readLockFile: lockMocks.readLockFile,
}))

vi.mock('../../src/lib/gist.js', () => ({
  findOrCreateGist: gistMocks.findOrCreateGist,
  writeGist: gistMocks.writeGist,
}))

const {default: Push} = await import('../../src/commands/push.js')

const GIST_ID = 'gist123'
const GITHUB_TOKEN = 'ghp_tok'
const SESSION_TOKEN = 'sess_abc'

const credentials = {
  gistId: GIST_ID,
  githubToken: GITHUB_TOKEN,
  token: SESSION_TOKEN,
  username: 'testuser',
}

const lockFile = {
  dismissed: {},
  lastSelectedAgents: [],
  skills: {
    'frontend-design': {
      installedAt: '2026-01-01T00:00:00Z',
      skillFolderHash: 'abc',
      skillPath: 'skills/frontend-design/SKILL.md',
      source: 'anthropics/skills',
      sourceType: 'github',
      sourceUrl: 'https://github.com/anthropics/skills.git',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  },
  version: 3,
}

const lockFileTwoSkills = {
  ...lockFile,
  skills: {
    ...lockFile.skills,
    'docx': {...lockFile.skills['frontend-design']},
  },
}

function makeCmd() {
  const cmd = new Push([], {} as Parameters<typeof Push>[1])
  const logSpy = vi.spyOn(cmd, 'log').mockImplementation(() => {})
  const errorSpy = vi.spyOn(cmd, 'error').mockImplementation((msg: unknown) => {
    throw new Error(String(msg))
  })
  return {cmd, errorSpy, logSpy}
}

describe('push command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('happy path — writes gist and logs skill count', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockResolvedValue(lockFile)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(gistMocks.findOrCreateGist).toHaveBeenCalledWith(GITHUB_TOKEN)
    expect(gistMocks.writeGist).toHaveBeenCalledWith(GIST_ID, lockFile, GITHUB_TOKEN)
    expect(credMocks.writeCredentials).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^Pushed 1 skill • /))
  })

  it('uses plural wording for multiple skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockResolvedValue(lockFileTwoSkills)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^Pushed 2 skills • /))
  })

  it('persists gistId when credentials are missing it', async () => {
    const credsWithoutGist = {
      githubToken: GITHUB_TOKEN,
      token: SESSION_TOKEN,
      username: 'testuser',
    }
    credMocks.readCredentials.mockResolvedValue(credsWithoutGist)
    lockMocks.readLockFile.mockResolvedValue(lockFile)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)

    const {cmd} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({
      ...credsWithoutGist,
      gistId: GIST_ID,
    })
  })

  it('updates credentials when gistId changes', async () => {
    const newGistId = 'gist456'
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockResolvedValue(lockFile)
    gistMocks.findOrCreateGist.mockResolvedValue(newGistId)

    const {cmd} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({
      ...credentials,
      gistId: newGistId,
    })
    expect(gistMocks.writeGist).toHaveBeenCalledWith(newGistId, lockFile, GITHUB_TOKEN)
  })

  it('errors when not logged in', async () => {
    credMocks.readCredentials.mockResolvedValue(null)

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith('Run `quiver login` first.')
  })

  it('errors when githubToken is missing', async () => {
    credMocks.readCredentials.mockResolvedValue({
      token: SESSION_TOKEN,
      username: 'testuser',
    })

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith('Run `quiver login` first.')
  })

  it('errors with helpful message when no global skills are installed', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockRejectedValue(
      new Error('No global skills found. Install skills with `npx skills add -g` first.'),
    )

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith(
      'No global skills found. Install skills with `npx skills add -g` first.',
    )
  })

  it('re-throws unexpected lock file errors', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockRejectedValue(new Error('permission denied'))

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow('permission denied')
    expect(errorSpy).not.toHaveBeenCalled()
  })
})
