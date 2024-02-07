import { db } from "~/server/data/prisma";
import * as resetToken from "~/server/data/reset-token";
import * as mailer from "~/server/utils/mailer";
import { useCompiler } from "#vue-email";

const success = {
  message:
    "If the email exists in the database, you should now a password reset link. Please check your spam folders as well.",
};

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return success;
  }

  const token = await resetToken.create(user.id);

  const template = await useCompiler("ResetPassword.vue", {
    props: { link: getHeader(event, "Host") + "/auth/reset-password/" + token },
  });

  await mailer.sendEmail([user.email], "Reset your password", template);

  return success;
});
