import * as resetToken from "~/server/data/reset-token";

export default defineEventHandler(async (event) => {
  const token = (getQuery(event)["token"] as string) || "";
  const validToken = await resetToken.validate(token);
  if (!validToken) {
    throw createError({
      message: "Invalid token.",
      status: 404,
    });
  }
  return {};
});
