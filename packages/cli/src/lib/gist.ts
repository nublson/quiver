/* eslint-disable n/no-unsupported-features/node-builtins */
import type { SkillLockFile } from "./types.js";

const GIST_API = "https://api.github.com/gists";
const GIST_FILENAME = "quiver-skill-lock.json";

const EMPTY_LOCK: SkillLockFile = {
  dismissed: {},
  lastSelectedAgents: [],
  skills: {},
  version: 3,
};

function githubHeaders(token: string): Record<string, string> {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "quiver-cli",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function throwIfNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }
}

/**
 * Find the user's quiver-skill-lock.json Gist or create it as a secret Gist.
 * Returns the Gist ID.
 *
 * Only inspects the first page (100 Gists) — sufficient for a personal tool.
 */
export async function findOrCreateGist(githubToken: string): Promise<string> {
  const listRes = await fetch(`${GIST_API}?per_page=100`, {
    headers: githubHeaders(githubToken),
  });
  await throwIfNotOk(listRes);

  type GistItem = { files: Record<string, { filename: string }>; id: string; };
  const gists = (await listRes.json()) as GistItem[];
  const existing = gists.find((g) =>
    Object.values(g.files).some((f) => f.filename === GIST_FILENAME),
  );
  if (existing) return existing.id;

  const createRes = await fetch(GIST_API, {
    body: JSON.stringify({
      description: "Quiver skill lock file",
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(EMPTY_LOCK, null, 2) },
      },
      public: false,
    }),
    headers: githubHeaders(githubToken),
    method: "POST",
  });
  await throwIfNotOk(createRes);

  const created = (await createRes.json()) as { id: string };
  return created.id;
}

/**
 * Fetch and parse the content of the Gist as a SkillLockFile.
 */
export async function readGist(
  gistId: string,
  githubToken: string,
): Promise<SkillLockFile> {
  const res = await fetch(`${GIST_API}/${gistId}`, {
    headers: githubHeaders(githubToken),
  });
  await throwIfNotOk(res);

  type GistDetail = {
    files: Record<string, undefined | { content: string; filename: string; }>;
  };
  const data = (await res.json()) as GistDetail;
  const file = data.files[GIST_FILENAME];
  if (!file) {
    throw new Error(
      `${GIST_FILENAME} not found in Gist. The Gist may have been manually renamed.`,
    );
  }

  return JSON.parse(file.content) as SkillLockFile;
}

/**
 * PATCH the Gist with updated lock content.
 */
export async function writeGist(
  gistId: string,
  lockData: SkillLockFile,
  githubToken: string,
): Promise<void> {
  const res = await fetch(`${GIST_API}/${gistId}`, {
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(lockData, null, 2) },
      },
    }),
    headers: githubHeaders(githubToken),
    method: "PATCH",
  });
  await throwIfNotOk(res);
}
