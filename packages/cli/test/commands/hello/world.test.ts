import {runCommand} from '@oclif/test'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {describe, expect, it, vi} from 'vitest'

const cliRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..')

describe('hello world', () => {
  it('runs hello world cmd', async () => {
    const logSpy = vi.spyOn(console, 'log')
    const {error} = await runCommand('hello world', {root: cliRoot})

    expect(error).toBeUndefined()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('hello world!'))
    logSpy.mockRestore()
  })
})
