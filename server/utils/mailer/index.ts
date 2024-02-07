import Plunk from "@plunk/node";

const plunk = new Plunk(process.env.PLUNK_API_KEY || "");

export async function send(to: string[], subject: string, body: string) {
  return await plunk.emails.send({
    to,
    subject,
    body,
  });
}
