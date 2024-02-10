import * as specializations from "~/server/data/specializations";
import { UserRole } from "@prisma/client";

const AUTHORIZED: UserRole[] = [
  UserRole.COURSE_AUDITOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      status: 400,
      message: "Missing slug",
    });
  }

  const user = event.context.user;

  if (!user) {
    throw createError({
      status: 401,
      message: "Unauthorized",
    });
  }

  if (!AUTHORIZED.includes(user.role)) {
    throw createError({
      status: 403,
      message: "Forbidden",
    });
  }

  const specialization = await specializations.getBySlug(slug);

  if (!specialization) {
    throw createError({
      status: 404,
      message: "Specialization not found",
    });
  }

  try {
    await specializations.deleteById(specialization.id);
    return {
      message: "Specialization deleted",
    };
  } catch (e: any) {
    throw createError({
      status: 500,
      message: e.message,
    });
  }
});
