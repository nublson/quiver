import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const cliRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..')

describe('hello world', () => {
  it('runs hello world cmd', async () => {
    const {stdout} = await runCommand('hello world', {root: cliRoot})
    expect(stdout).to.contain('hello world!')
  })
})
