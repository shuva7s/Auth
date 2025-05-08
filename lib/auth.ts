import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/drizzle";
import { sendEmail } from "./emails/verification";
import {
  account_table,
  session_table,
  user_table,
  verification_table,
} from "@/database/schema";
import { openAPI } from "better-auth/plugins";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user_table,
      session: session_table,
      account: account_table,
      verification: verification_table,
    },
  }),
  plugins: [openAPI()],

  advanced: {
    cookies: {
      session_token: {
        name: "auth_session_token",
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
      // when user logs in with a trusted provider, automatically link the account
      allowDifferentEmails: false,
      allowUnlinkingAll: false,
    },
  },

  session: {
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 5 * 60,
    // },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // day (every 1 day the session expiration is updated)
    // freshAge: 0,
    // disableSessionRefresh: true
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 50,
    requireEmailVerification: true,
    password: {
      hash: async (password) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ password, hash }) => {
        return await bcrypt.compare(password, hash);
      },
    },
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    resetPasswordTokenExpiresIn: 5 * 60,
  },

  emailVerification: {
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url }) => {
        await sendEmail({
          to: user.email, // verification email must be sent to the current user email to approve the change
          subject: "Approve email change",
          text: `Click the link to approve the change: ${url}`,
        });
      },
    },
    deleteUser: {
      enabled: true,
      // beforeDelete: async (user) => {
      //   // Perform any cleanup or additional checks here
      // },
      // sendDeleteAccountVerification: async ({ user, url }) => {
      //   sendEmail({
      //     to: user.email,
      //     subject: "Approve account deletion",
      //     text: `Click the link to approve the change: ${url}`,
      //   });
      // },
      afterDelete: async (user) => {
        // lets delete the user
        await db.delete(user_table).where(eq(user_table.id, user.id));
      },
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
