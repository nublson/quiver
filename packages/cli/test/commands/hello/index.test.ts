import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const cliRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..')

describe('hello', () => {
  it('runs hello', async () => {
    const {stdout} = await runCommand('hello friend --from oclif', {root: cliRoot})
    expect(stdout).to.contain('hello friend from oclif!')
  })
})
