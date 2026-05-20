import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

import type { Credentials } from "./types.js";

export const CREDENTIALS_PATH = join(homedir(), ".quiver", "credentials.json");

/**
 * Read and parse ~/.quiver/credentials.json.
 * Returns null if the file does not exist (user not logged in).
 * Throws if the file exists but cannot be parsed or read.
 */
export async function readCredentials(): Promise<Credentials | null> {
  try {
    const raw = await readFile(CREDENTIALS_PATH, "utf8");
    return JSON.parse(raw) as Credentials;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/**
 * Write credentials to ~/.quiver/credentials.json.
 * Creates ~/.quiver/ if it does not exist.
 */
export async function writeCredentials(data: Credentials): Promise<void> {
  await mkdir(dirname(CREDENTIALS_PATH), { recursive: true });
  await writeFile(CREDENTIALS_PATH, JSON.stringify(data, null, 2), "utf8");
}
