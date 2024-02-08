import * as users from "~/server/data/users";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  // must be logged in
  if (!user) {
    throw createError({
      statusCode: 401,
    });
  }

  const requestUser = await users.getById(user.id);

  return requestUser;
});
