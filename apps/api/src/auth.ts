import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins/bearer";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db.js";

export const auth = betterAuth({
  // BETTER_AUTH_SECRET and BETTER_AUTH_URL are read automatically from env vars
  basePath: "/auth",

  database: prismaAdapter(prisma, { provider: "postgresql" }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    bearer(), // enables session tokens as Bearer tokens for CLI API calls (Phase 2+)
  ],

  rateLimit: {
    enabled: true,
    storage: "database", // required for Vercel serverless — no in-memory state
    window: 10,
    max: 100,
    customRules: {
      "/auth/sign-in/social": { window: 60, max: 20 },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 days
    updateAge: 60 * 60 * 24,       // refresh sliding window every 24h
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,              // 5-minute cookie cache
      strategy: "compact",         // HMAC-signed, smallest footprint
    },
  },

  account: {
    encryptOAuthTokens: true, // AES-256-GCM encrypt stored OAuth tokens
  },

  trustedOrigins: [process.env.BASE_URL!],

  advanced: {
    useSecureCookies: true,
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"], // Vercel proxy header
    },
    backgroundTasks: {
      // Vercel: patch waitUntil via globalThis in api/index.ts to avoid circular imports
      handler: (promise: Promise<unknown>) => {
        const wU = (globalThis as Record<string, unknown>).__waitUntil;
        if (typeof wU === "function") {
          (wU as (p: Promise<unknown>) => void)(promise);
        }
      },
    },
  },

  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          console.log(`[audit] session.created userId=${session.userId}`);
        },
      },
    },
    account: {
      create: {
        after: async (account) => {
          console.log(`[audit] account.linked provider=${account.providerId} userId=${account.userId}`);
        },
      },
    },
  },
});
