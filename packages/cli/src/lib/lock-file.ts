import {readFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {join} from 'node:path'

import type {SkillLockFile} from './types.js'

/** Path to the global skill lock file maintained by `npx skills`. */
export const LOCK_FILE_PATH = join(homedir(), '.agents', '.skill-lock.json')

/**
 * Read and parse ~/.agents/.skill-lock.json.
 *
 * Throws with a helpful message when the file is missing — the user likely has
 * not installed any global skills yet.
 */
export async function readLockFile(): Promise<SkillLockFile> {
  try {
    const raw = await readFile(LOCK_FILE_PATH, 'utf8')
    return JSON.parse(raw) as SkillLockFile
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
