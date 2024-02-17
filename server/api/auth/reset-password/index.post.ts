import { db } from "~/server/data/prisma";
import * as resetToken from "~/server/data/reset-token";
import * as mailer from "~/server/utils/mailer";
import { config } from "@vue-email/compiler";

const success = {
  message:
    "If the email exists in the database, you should now receive a password reset link. Please check your spam folders as well.",
};

function generateResetPasswordEmail(name: string, resetLink: string) {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <tr>
                <td style="padding: 20px;">
                    <h2 style="font-size: 24px;">Hi ${name},</h2>
                    <p style="font-size: 16px;">You requested to reset your password. Please click the button below to proceed.</p>
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="padding: 15px; text-align: center;">
                                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                            </td>
                        </tr>
                    </table>
                    <p style="font-size: 16px;">If you did not request a password reset, please ignore this email or contact support.</p>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;

  return emailHtml;
}

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  if (!email) {
    throw createError({
      message: "Email is required.",
      status: 400,
    });
  }
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return success;
  }

  const token = await resetToken.create(user.id);

  const template = generateResetPasswordEmail(
    user.firstName,
    getHeader(event, "Host") + "/auth/reset-password/" + token
  );

  await mailer.sendEmail([user.email], "Reset your password", template);

  return success;
});
