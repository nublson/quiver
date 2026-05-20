import type {ChildProcess} from 'node:child_process'

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

const spawnMocks = vi.hoisted(() => ({
  spawn: vi.fn(),
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

vi.mock('node:child_process', () => ({
  spawn: spawnMocks.spawn,
}))

const {default: Sync, skillNameFromSkillPath} = await import('../../src/commands/sync.js')

const GIST_ID = 'gist123'
const GITHUB_TOKEN = 'ghp_tok'
const SESSION_TOKEN = 'sess_abc'

const credentials = {
  gistId: GIST_ID,
  githubToken: GITHUB_TOKEN,
  token: SESSION_TOKEN,
  username: 'testuser',
}

const skillEntry = {
  installedAt: '2026-01-01T00:00:00Z',
  skillFolderHash: 'abc',
  skillPath: 'skills/frontend-design/SKILL.md',
  source: 'anthropics/skills',
  sourceType: 'github',
  sourceUrl: 'https://github.com/anthropics/skills.git',
  updatedAt: '2026-01-01T00:00:00Z',
}

const remoteLockOne = {
  dismissed: {},
  lastSelectedAgents: [],
  skills: {
    'frontend-design': skillEntry,
  },
  version: 3,
}

function makeFakeChild(closeCode: null | number, signal: NodeJS.Signals | null = null): ChildProcess {
  return {
    on(event: string, listener: (...args: unknown[]) => void) {
      if (event === 'close') {
        queueMicrotask(() => {
          listener(closeCode, signal)
        })
      }
    },
  } as ChildProcess
}

function stubSpawnSuccess() {
  spawnMocks.spawn.mockImplementation(() => makeFakeChild(0))
}

function makeCmd() {
  const cmd = new Sync([], {} as Parameters<typeof Sync>[1])
  const logSpy = vi.spyOn(cmd, 'log').mockImplementation(() => {})
  const errorSpy = vi.spyOn(cmd, 'error').mockImplementation((msg: unknown) => {
    throw new Error(String(msg))
  })
  return {cmd, errorSpy, logSpy}
}

describe('sync', () => {
  describe('skillNameFromSkillPath', () => {
    it('derives folder name before SKILL.md', () => {
      expect(skillNameFromSkillPath('skills/frontend-design/SKILL.md')).toBe('frontend-design')
    })

    it('throws when path segments are insufficient', () => {
      expect(() => skillNameFromSkillPath('SKILL.md')).toThrow(/Invalid skillPath/)
    })
  })

  describe('command', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      stubSpawnSuccess()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('installs one missing skill and logs summary', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(remoteLockOne)
    lockMocks.readLockFileIfExists.mockResolvedValue({
      dismissed: {},
      lastSelectedAgents: [],
      skills: {},
      version: 3,
    })

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(gistMocks.readGist).toHaveBeenCalledWith(GIST_ID, GITHUB_TOKEN)
    expect(spawnMocks.spawn).toHaveBeenCalledTimes(1)
    expect(spawnMocks.spawn).toHaveBeenCalledWith(
      'npx',
      [
        'skills',
        'add',
        'https://github.com/anthropics/skills.git',
        '--skill',
        'frontend-design',
        '-g',
        '-y',
      ],
      expect.objectContaining({shell: process.platform === 'win32', stdio: 'inherit'}),
    )
    expect(logSpy).toHaveBeenCalledWith('1 skill added, 0 already up to date')
  })

  it('uses plural wording and counts up-to-date skills', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue({
      ...remoteLockOne,
      skills: {
        docx: {...skillEntry, skillPath: 'skills/docx/SKILL.md'},
        'frontend-design': skillEntry,
      },
    })
    lockMocks.readLockFileIfExists.mockResolvedValue({
      dismissed: {},
      lastSelectedAgents: [],
      skills: {'frontend-design': skillEntry},
      version: 3,
    })

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(spawnMocks.spawn).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('1 skill added, 1 already up to date')
  })

  it('installs all remote skills when local lock is missing', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue({
      ...remoteLockOne,
      skills: {
        docx: {...skillEntry, skillPath: 'skills/docx/SKILL.md'},
        'frontend-design': skillEntry,
      },
    })
    lockMocks.readLockFileIfExists.mockResolvedValue(null)

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(spawnMocks.spawn).toHaveBeenCalledTimes(2)
    expect(logSpy).toHaveBeenCalledWith('2 skills added, 0 already up to date')
  })

  it('does not spawn when everything is up to date', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(remoteLockOne)
    lockMocks.readLockFileIfExists.mockResolvedValue(remoteLockOne)

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(spawnMocks.spawn).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('0 skills added, 1 already up to date')
  })

  it('persists gistId when credentials are missing it', async () => {
    const credsWithoutGist = {
      githubToken: GITHUB_TOKEN,
      token: SESSION_TOKEN,
      username: 'testuser',
    }
    credMocks.readCredentials.mockResolvedValue(credsWithoutGist)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(remoteLockOne)
    lockMocks.readLockFileIfExists.mockResolvedValue(remoteLockOne)

    const {cmd} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({
      ...credsWithoutGist,
      gistId: GIST_ID,
    })
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

  it('propagates install failures', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    gistMocks.readGist.mockResolvedValue(remoteLockOne)
    lockMocks.readLockFileIfExists.mockResolvedValue({
      dismissed: {},
      lastSelectedAgents: [],
      skills: {},
      version: 3,
    })
    spawnMocks.spawn.mockImplementation(() => makeFakeChild(1))

    const {cmd} = makeCmd()
    await expect(cmd.run()).rejects.toThrow('npx skills add exited with code 1')
  })
  })
})
