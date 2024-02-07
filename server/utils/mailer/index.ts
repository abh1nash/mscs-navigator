import { ofetch } from "ofetch";

export async function sendEmail(to: string[], subject: string, body: string) {
  return await ofetch("https://api.plunk.email/v1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
    },
    body: JSON.stringify({
      to,
      subject,
      body,
    }),
  });
}
