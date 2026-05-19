import { prisma } from "../db.js";

export type CliSession = NonNullable<
  Awaited<ReturnType<typeof prisma.cliSession.findFirst>>
>;

export async function createCliSession(state: string): Promise<void> {
  await prisma.cliSession.upsert({
    where: { state },
    create: { state, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    update: {}, // no-op if state already exists
  });
}

export async function completeCliSession(
  state: string,
  token: string,
  userId: string,
  username: string
): Promise<void> {
  await prisma.cliSession.updateMany({
    where: { state, expiresAt: { gt: new Date() } },
    data: { token, userId, username },
  });
}

export async function getCliSession(state: string): Promise<CliSession | null> {
  return prisma.cliSession.findFirst({
    where: { state, expiresAt: { gt: new Date() } },
  });
}

export async function deleteCliSession(state: string): Promise<void> {
  await prisma.cliSession.delete({ where: { state } }).catch(() => {
    // Ignore if already deleted (race condition on double-poll)
  });
}
