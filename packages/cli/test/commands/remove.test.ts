import type {ChildProcess} from 'node:child_process'

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const credMocks = vi.hoisted(() => ({
  readCredentials: vi.fn(),
  writeCredentials: vi.fn().mockResolvedValue(),
}))

const lockMocks = vi.hoisted(() => ({
  readLockFile: vi.fn(),
  writeLockFile: vi.fn().mockResolvedValue(),
}))

const gistMocks = vi.hoisted(() => ({
  findOrCreateGist: vi.fn(),
  writeGist: vi.fn().mockResolvedValue(),
}))

const spawnMocks = vi.hoisted(() => ({
  spawn: vi.fn(),
}))

vi.mock('../../src/lib/credentials.js', () => ({
  readCredentials: credMocks.readCredentials,
  writeCredentials: credMocks.writeCredentials,
}))

vi.mock('../../src/lib/lock-file.js', () => ({
  readLockFile: lockMocks.readLockFile,
  writeLockFile: lockMocks.writeLockFile,
}))

vi.mock('../../src/lib/gist.js', () => ({
  findOrCreateGist: gistMocks.findOrCreateGist,
  writeGist: gistMocks.writeGist,
}))

vi.mock('node:child_process', () => ({
  spawn: spawnMocks.spawn,
}))

const {default: Remove} = await import('../../src/commands/remove.js')

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

const lockWithSkill = {
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

function makeCmd(argv: string[] = ['frontend-design']) {
  const config = {runHook: vi.fn().mockResolvedValue({failures: [], successes: []})} as unknown as Parameters<typeof Remove>[1]
  const cmd = new Remove(argv, config)
  const logSpy = vi.spyOn(cmd, 'log').mockImplementation(() => {})
  const errorSpy = vi.spyOn(cmd, 'error').mockImplementation((msg: unknown) => {
    throw new Error(String(msg))
  })
  return {cmd, errorSpy, logSpy}
}

describe('remove', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    stubSpawnSuccess()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('removes skill from lock, writes lock, and pushes', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockResolvedValue({...lockWithSkill, skills: {'frontend-design': skillEntry}})
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)

    const {cmd, logSpy} = makeCmd()
    await cmd.run()

    expect(spawnMocks.spawn).toHaveBeenCalledWith(
      'npx',
      ['skills', 'rm', 'skills/frontend-design/SKILL.md'],
      expect.objectContaining({shell: process.platform === 'win32', stdio: 'inherit'}),
    )

    const writtenLock = lockMocks.writeLockFile.mock.calls[0][0]
    expect(writtenLock.skills['frontend-design']).toBeUndefined()

    expect(gistMocks.writeGist).toHaveBeenCalledWith(GIST_ID, writtenLock, GITHUB_TOKEN)
    expect(logSpy).toHaveBeenCalledWith('Removed frontend-design and pushed updated lock')
  })

  it('errors when skill is not in lock file', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)
    lockMocks.readLockFile.mockResolvedValue({dismissed: {}, lastSelectedAgents: [], skills: {}, version: 3})

    const {cmd, errorSpy} = makeCmd()
    await expect(cmd.run()).rejects.toThrow()
    expect(errorSpy).toHaveBeenCalledWith('Skill "frontend-design" not found in lock file.')
    expect(spawnMocks.spawn).not.toHaveBeenCalled()
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

  it('propagates npx skills rm failure', async () => {
    credMocks.readCredentials.mockResolvedValue(credentials)
    lockMocks.readLockFile.mockResolvedValue({...lockWithSkill, skills: {'frontend-design': skillEntry}})
    spawnMocks.spawn.mockImplementation(() => makeFakeChild(1))

    const {cmd} = makeCmd()
    await expect(cmd.run()).rejects.toThrow('npx skills rm exited with code 1')
    expect(lockMocks.writeLockFile).not.toHaveBeenCalled()
    expect(gistMocks.writeGist).not.toHaveBeenCalled()
  })

  it('persists gistId when credentials are missing it', async () => {
    const credsWithoutGist = {githubToken: GITHUB_TOKEN, token: SESSION_TOKEN, username: 'testuser'}
    credMocks.readCredentials.mockResolvedValue(credsWithoutGist)
    lockMocks.readLockFile.mockResolvedValue({...lockWithSkill, skills: {'frontend-design': skillEntry}})
    gistMocks.findOrCreateGist.mockResolvedValue(GIST_ID)

    const {cmd} = makeCmd()
    await cmd.run()

    expect(credMocks.writeCredentials).toHaveBeenCalledWith({...credsWithoutGist, gistId: GIST_ID})
  })
})
