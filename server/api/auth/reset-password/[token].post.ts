import { db } from "~/server/data/prisma";
import * as resetToken from "~/server/data/reset-token";
import * as users from "~/server/data/users";

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, "token") || "";
  const { password } = await readBody(event);

  if (!password) {
    throw createError({
      message: "Password is required.",
      status: 400,
    });
  }

  const validToken = await resetToken.validate(token);

  if (!validToken) {
    throw createError({
      message: "Invalid token.",
      status: 404,
    });
  }

  await users.updatePassword(validToken.userId, password);

  await resetToken.consume(token);

  return { message: "Password reset successfully." };
});
