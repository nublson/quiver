/** Shape of ~/.quiver/credentials.json */
export interface Credentials {
  /** ID of the user's quiver-skill-lock.json secret Gist. Written on first push. */
  gistId?: string;
  /** GitHub OAuth access token with 'gist' scope */
  githubToken: string;
  /** better-auth session token (Bearer token for API calls) */
  token: string;
  /** GitHub username */
  username: string;
}

/** One skill entry as written by `npx skills add -g` */
export interface SkillEntry {
  installedAt: string;
  skillFolderHash: string;
  skillPath: string;
  source: string;
  sourceType: string;
  sourceUrl: string;
  updatedAt: string;
}

/** Structure of ~/.agents/.skill-lock.json */
export interface SkillLockFile {
  dismissed?: Record<string, boolean>;
  lastSelectedAgents?: string[];
  skills: Record<string, SkillEntry>;
  version: number;
}
