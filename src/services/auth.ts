import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { helpers } from "../helpers.js";
import { dbService } from "./db/index.js";
import { emailService } from "./email.js";

export const authService = (context?: HonoContext) => {
  const { getEnv, getEnvAsArray } = helpers(context);

  const trustedOrigins = getEnvAsArray("AUTH_TRUSTED_ORIGINS", "https://app.example.com");

  const { dbClient } = dbService(context);

  const authClient = betterAuth({
    baseURL: getEnv("BASE_URL", "https://api.example.com"),
    basePath: "/api/auth",
    secret: getEnv("AUTH_SECRET"),
    trustedOrigins,
    database: drizzleAdapter(dbClient, {
      provider: "pg",
    }),
    advanced: {
      cookiePrefix: "example",
      crossSubDomainCookies: {
        enabled: true,
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
      },
    },
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async ({ user, url }) => {
          const { sendEmail } = emailService(context);

          await sendEmail({ email: user.email }, "Approve your new email", {
            text: `Click here to approve your new email: ${url}`,
          });
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      sendResetPassword: async ({ user, url }) => {
        const { sendEmail } = emailService(context);

        await sendEmail({ email: user.email }, "Reset your password", {
          text: `Click here to reset your password: ${url}`,
        });
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, token }) => {
        const { sendEmail } = emailService(context);

        const redirectUrl = encodeURIComponent(`${getEnv("APP_URL")}/?email-verified=true`);
        const url = `${getEnv("BASE_URL")}/api/auth/verify-email?token=${token}&callbackURL=${redirectUrl}`;

        await sendEmail({ email: user.email }, "Verify your email", {
          text: `Click here to verify your email: ${url}`,
        });
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
    },
    plugins: [admin()],
  });

  return {
    trustedOrigins,
    authClient,
  };
};
