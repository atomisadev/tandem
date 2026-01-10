import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../common/db";
import { APIError } from "better-auth/api";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["read:user", "read:org", "repo"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const isWhitelisted = await prisma.whitelist.findUnique({
            where: {
              email: user.email,
            },
          });

          if (!isWhitelisted) {
            throw new APIError("FORBIDDEN", {
              message: "Access denied. You are not on the whitelist.",
            });
          }

          return { data: user };
        },
      },
    },
  },
  baseURL: "http://localhost:3000/api/auth",
  trustedOrigins: ["http://localhost:3000"],
});
