import {Command} from '@oclif/core'

import type {SkillEntry} from '../lib/types.js'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, readGist} from '../lib/gist.js'
import {readLockFileIfExists} from '../lib/lock-file.js'
import {cyan, dim, green, yellow} from '../lib/ui.js'

function printSection(
  log: (s: string) => void,
  header: string,
  names: string[],
  getSource: (name: string) => string,
): void {
  log(header)
  if (names.length === 0) return

  let maxLen = 0
  for (const n of names) if (n.length > maxLen) maxLen = n.length
  for (const name of names) {
    const source = getSource(name)
    const suffix = source ? ' '.repeat(maxLen - name.length + 3) + dim(source) : ''
    log(`     ${name}${suffix}`)
  }

  log('')
}

export default class Status extends Command {
  static description = 'Show a diff between your local and remote skill lock'
  static examples = ['<%= config.bin %> status']

  async run(): Promise<void> {
    const creds = await readCredentials()
    if (!creds?.githubToken) {
      this.error('Run `quiver login` first.')
    }

    const gistId = await findOrCreateGist(creds.githubToken)

    if (creds.gistId !== gistId) {
      await writeCredentials({...creds, gistId})
    }

    const remote = await readGist(gistId, creds.githubToken)
    const localSkills: Record<string, SkillEntry> =
      (await readLockFileIfExists())?.skills ?? {}

    const remoteKeys = new Set(Object.keys(remote.skills))
    const localKeys = new Set(Object.keys(localSkills))

    const localOnly = [...localKeys].filter((k) => !remoteKeys.has(k)).sort()
    const remoteOnly = [...remoteKeys].filter((k) => !localKeys.has(k)).sort()
    const inSync = [...localKeys].filter((k) => remoteKeys.has(k)).sort()

    if (localOnly.length === 0 && remoteOnly.length === 0 && inSync.length === 0) {
      this.log('  No skills found locally or remotely.')
      return
    }

    this.log('')
    this.log(`  comparing local ↔ remote  ${dim(`(gist · @${creds.username})`)}`)
    this.log('')

    const localSigil = localOnly.length > 0 ? yellow('↑') : dim('↑')
    const localHint = localOnly.length > 0 ? dim('   → run quiver push to upload') : ''
    printSection(
      this.log.bind(this),
      `  ${localSigil} local only   (${localOnly.length})${localHint}`,
      localOnly,
      () => '',
    )

    const remoteSigil = remoteOnly.length > 0 ? cyan('↓') : dim('↓')
    const remoteHint = remoteOnly.length > 0 ? dim('   → run quiver sync to install') : ''
    printSection(
      this.log.bind(this),
      `  ${remoteSigil} remote only  (${remoteOnly.length})${remoteHint}`,
      remoteOnly,
      (name) => remote.skills[name]?.source ?? '',
    )

    const syncSigil = inSync.length > 0 ? green('✔') : dim('✔')
    printSection(
      this.log.bind(this),
      `  ${syncSigil} in sync      (${inSync.length})`,
      inSync,
      (name) => localSkills[name]?.source ?? '',
    )
  }
}
