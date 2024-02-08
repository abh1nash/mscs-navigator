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

  const requestUser = await users.getById(requestUserId);

  if (!requestUser) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  // cannot edit super admin
  if (requestUser.role === UserRole.SUPER_ADMIN) {
    throw createError({
      statusCode: 400,
      message: "Cannot edit super admin",
    });
  }

  // must be authorized
  // either has to be admin or be updating their own information
  if (!AUTHORIZED.includes(user.role) && requestUserId !== user.id) {
    throw createError({
      statusCode: 403,
    });
  }

  const { firstName, lastName, email, role } = await readBody(event);

  // need these fields
  if (!firstName || !lastName || !email) {
    throw createError({
      statusCode: 400,
      message: "First name, last name, and email are required",
    });
  }

  // role must be valid
  if (!Object.values(UserRole).includes(role)) {
    throw createError({
      statusCode: 400,
      message: "Invalid role",
    });
  }

  const updated = await users.update(requestUserId, {
    firstName,
    lastName,
    email,
    role: AUTHORIZED.includes(user.role) ? role : requestUser.role,
  });

  return { message: "User updated successfully", userId: updated.id };
});
