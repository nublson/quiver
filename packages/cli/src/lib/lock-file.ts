import {mkdir, readFile, writeFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {dirname, join} from 'node:path'

import type {SkillLockFile} from './types.js'

/** Path to the global skill lock file maintained by `npx skills`. */
export const LOCK_FILE_PATH = join(homedir(), '.agents', '.skill-lock.json')

async function readLockFileFromDisk(): Promise<SkillLockFile> {
  const raw = await readFile(LOCK_FILE_PATH, 'utf8')
  return JSON.parse(raw) as SkillLockFile
}

/**
 * Read and parse ~/.agents/.skill-lock.json.
 *
 * Throws with a helpful message when the file is missing — the user likely has
 * not installed any global skills yet.
 */
export async function readLockFile(): Promise<SkillLockFile> {
  try {
    return await readLockFileFromDisk()
  } catch (error) {
    const {code} = error as NodeJS.ErrnoException
    if (code === 'ENOENT') {
      throw new Error(
        'No global skills found. Install skills with `npx skills add -g` first.',
      )
    }

    throw error
  }
}

/**
 * Read the lock file when present. Returns null if the file is missing (e.g. a
 * fresh device before any global skills are installed).
 */
export async function readLockFileIfExists(): Promise<null | SkillLockFile> {
  try {
    return await readLockFileFromDisk()
  } catch (error) {
    const {code} = error as NodeJS.ErrnoException
    if (code === 'ENOENT') return null
    throw error
  }
}

/**
 * Write ~/.agents/.skill-lock.json. Creates the parent directory when needed.
 */
export async function writeLockFile(lock: SkillLockFile): Promise<void> {
  await mkdir(dirname(LOCK_FILE_PATH), {recursive: true})
  await writeFile(LOCK_FILE_PATH, JSON.stringify(lock, null, 2), 'utf8')
}
