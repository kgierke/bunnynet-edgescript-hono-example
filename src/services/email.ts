import { helpers } from "../helpers.js";

export interface EmailServiceTo {
  email: string;
  name?: string;
}

export interface EmailServiceBody {
  html?: string;
  text: string;
}

export const emailService = (c?: HonoContext) => {
  const apiBaseUrl = "https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par";

  const { getEnv } = helpers(c);

  const sendEmail = async (to: EmailServiceTo, subject: string, body: EmailServiceBody) => {
    const res = await fetch(`${apiBaseUrl}/emails`, {
      method: "POST",
      headers: {
        "X-Auth-Token": getEnv("SCW_SECRET_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: getEnv("SCW_PROJECT_ID"),
        from: {
          email: getEnv("AUTH_EMAIL_FROM", "auth@mail.example.com"),
          name: getEnv("AUTH_EMAIL_FROM_NAME", "example"),
        },
        to: [to],
        subject,
        html: body.html || body.text,
        text: body.text,
      }),
    });

    return res.json();
  };

  return {
    sendEmail,
  };
};
