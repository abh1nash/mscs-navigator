import { UserRole } from "@prisma/client";
import * as users from "~/server/data/users";

const AUTHORIZED: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  // must be logged in
  if (!user) {
    throw createError({
      statusCode: 401,
    });
  }

  const requestUserId = getRouterParam(event, "id");

  if (!requestUserId) {
    throw createError({
      statusCode: 400,
      message: "Invalid user id",
    });
  }

  // cannot delete self
  if (requestUserId === user.id) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete self",
    });
  }

  // must be authorized
  // either has to be admin or be deleting their own account
  if (!AUTHORIZED.includes(user.role)) {
    throw createError({
      statusCode: 403,
    });
  }

  const requestUser = await users.getById(requestUserId);

  if (!requestUser) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  // cannot delete super admin
  if (requestUser.role === UserRole.SUPER_ADMIN) {
    throw createError({
      statusCode: 400,
      message: "Cannot delete super admin",
    });
  }

  await users.deleteById(requestUserId);

  return { message: "User deleted successfully." };
});
