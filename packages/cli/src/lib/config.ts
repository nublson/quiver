import {env} from 'node:process'

/** Quiver API base URL. Override with QUIVER_API_URL (env or packages/cli/.env in dev). */
export const API_BASE = env.QUIVER_API_URL ?? 'https://api.quiver.nublson.com'
