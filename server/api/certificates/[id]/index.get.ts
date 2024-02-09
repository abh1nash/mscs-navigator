import * as certificates from "~/server/data/certificates";
import { UserRole } from "@prisma/client";

const AUTHORIZED: UserRole[] = [
  UserRole.ADMIN,
  UserRole.COURSE_AUDITOR,
  UserRole.SUPER_ADMIN,
];

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

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing id",
    });
  }
  const certificate = await certificates.getById(id);

  if (!certificate) {
    throw createError({
      statusCode: 404,
    });
  }

  return certificate;
});
