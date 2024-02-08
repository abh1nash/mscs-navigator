import * as users from "~/server/data/users";
import { UserRole } from "@prisma/client";

const AUTHORIZED: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  // must be logged in
  if (!user) {
    throw createError({
      statusCode: 401,
    });
  }

  // must be authorized
  if (!AUTHORIZED.includes(user.role)) {
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

  // cannot create super admin
  if (role === UserRole.SUPER_ADMIN) {
    throw createError({
      statusCode: 400,
      message: "Cannot create super admin",
    });
  }

  // generate random password
  // they will need to reset it
  const password = Math.random().toString(36).slice(-8);

  const newUser = await users.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  return { message: "User created successfully", userId: newUser.id };
});
