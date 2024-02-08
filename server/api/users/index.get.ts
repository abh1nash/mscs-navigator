import { UserRole } from "@prisma/client";
import * as users from "~/server/data/users";
import { z } from "zod";

const AUTHORIZED: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

const querySchema = z.object({
  query: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  role: z.nativeEnum(UserRole).optional(),
});

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

  const validParams = await getValidatedQuery(event, (q) =>
    querySchema.safeParse(q)
  );

  if (!validParams.success) {
    throw createError({
      statusCode: 400,
      message: validParams.error.issues[0].message,
    });
  }

  const filteredUsers = await users.filter(
    {
      query: validParams.data.query,
      role: validParams.data.role,
    },
    (validParams.data.page || 1) * (validParams.data.limit || 0),
    validParams.data.limit || 10
  );
  return {
    results: filteredUsers.data,
    pagination: {
      total: filteredUsers.total,
    },
  };
});
