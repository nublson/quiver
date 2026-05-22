import {Command} from '@oclif/core'
import {Listr} from 'listr2'

import type {SkillLockFile} from '../lib/types.js'

import {readCredentials, writeCredentials} from '../lib/credentials.js'
import {findOrCreateGist, writeGist} from '../lib/gist.js'
import {readLockFile} from '../lib/lock-file.js'

interface PushCtx {
  gistId: string
  lockData: SkillLockFile
  skillCount: number
}

export default class Push extends Command {
  static description = 'Upload your local skill lock to GitHub Gist'
  static examples = ['<%= config.bin %> push']

  async run(): Promise<void> {
    const creds = await readCredentials()
    if (!creds?.githubToken) {
      this.error('Run `quiver login` first.')
    }

    const tasks = new Listr<PushCtx>(
      [
        {
          async task(ctx, wrapper) {
            try {
              ctx.lockData = await readLockFile()
            } catch (error) {
              const msg = error instanceof Error ? error.message : String(error)
              if (msg.includes('No global skills found')) throw new Error(msg)
              throw error
            }

            ctx.skillCount = Object.keys(ctx.lockData.skills ?? {}).length
            const word = ctx.skillCount === 1 ? 'skill' : 'skills'
            wrapper.title = `read ${ctx.skillCount} ${word} from lock file`
          },
          title: 'reading ~/.agents/.skill-lock.json',
        },
        {
          async task(ctx, wrapper) {
            ctx.gistId = await findOrCreateGist(creds.githubToken)
            if (creds.gistId !== ctx.gistId) {
              await writeCredentials({...creds, gistId: ctx.gistId})
            }

            wrapper.title = `gist · @${creds.username}`
          },
          title: `resolving gist · @${creds.username}`,
        },
        {
          async task(ctx, wrapper) {
            await writeGist(ctx.gistId, ctx.lockData, creds.githubToken)
            wrapper.title = `pushed · @${creds.username}`
          },
          title: 'uploading to gist',
        },
      ],
      {concurrent: false},
    )

    let ctx: PushCtx
    try {
      ctx = await tasks.run()
    } catch (error) {
      const cause = (error as {errors?: Error[]}).errors?.[0] ?? error
      throw cause
    }

    const word = ctx.skillCount === 1 ? 'skill' : 'skills'
    this.log(`${ctx.skillCount} ${word} pushed`)
  }
}
