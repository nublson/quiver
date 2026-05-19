import {runCommand} from '@oclif/test'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {describe, expect, it, vi} from 'vitest'

const cliRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..')

describe('hello', () => {
  it('runs hello', async () => {
    const logSpy = vi.spyOn(console, 'log')
    const {error} = await runCommand('hello friend --from oclif', {root: cliRoot})

    expect(error).toBeUndefined()
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('hello friend from oclif!'),
    )
    logSpy.mockRestore()
  })
})
