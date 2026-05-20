#!/usr/bin/env node

import {execute} from '@oclif/core'
import {config} from 'dotenv'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

config({path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env')})

await execute({development: true, dir: import.meta.url})
