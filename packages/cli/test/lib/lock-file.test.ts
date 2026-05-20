import {beforeEach, describe, expect, it, vi} from 'vitest'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}))

const fsMock = await import('node:fs/promises')
const {LOCK_FILE_PATH, readLockFile} = await import('../../src/lib/lock-file.js')

const lockFile = {
  dismissed: {},
  lastSelectedAgents: ['cursor'],
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

describe('lock-file lib', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('reads and parses LOCK_FILE_PATH', async () => {
    vi.mocked(fsMock.readFile).mockResolvedValueOnce(JSON.stringify(lockFile) as unknown as Buffer)

    const result = await readLockFile()

    expect(fsMock.readFile).toHaveBeenCalledWith(LOCK_FILE_PATH, 'utf8')
    expect(result).toEqual(lockFile)
  })

  it('throws a helpful message when the lock file is missing', async () => {
    const err = Object.assign(new Error('not found'), {code: 'ENOENT'})
    vi.mocked(fsMock.readFile).mockRejectedValueOnce(err)

    await expect(readLockFile()).rejects.toThrow(
      'No global skills found. Install skills with `npx skills add -g` first.',
    )
  })

  it('re-throws non-ENOENT read errors', async () => {
    const err = Object.assign(new Error('permission denied'), {code: 'EACCES'})
    vi.mocked(fsMock.readFile).mockRejectedValueOnce(err)

    await expect(readLockFile()).rejects.toThrow('permission denied')
  })

  it('re-throws JSON parse errors', async () => {
    vi.mocked(fsMock.readFile).mockResolvedValueOnce('not valid json' as unknown as Buffer)

    await expect(readLockFile()).rejects.toThrow()
  })
})
