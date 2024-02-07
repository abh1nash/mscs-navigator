import { ofetch } from "ofetch";

export async function sendEmail(to: string[], subject: string, body: string) {
  const config = useAppConfig();

  const response = await ofetch("https://api.useplunk.com/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.plunkAPIKey}`,
    },
    body: JSON.stringify({
      to,
      subject,
      body,
    }),
  });

  return await response;
}
