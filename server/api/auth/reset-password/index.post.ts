import { db } from "~/server/data/prisma";
import * as resetToken from "~/server/data/reset-token";

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
  // TODO: Send email with reset link
  console.log(token);
  return success;
});
