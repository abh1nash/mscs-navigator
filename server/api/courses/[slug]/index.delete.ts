import * as courses from "~/server/data/courses";
import { UserRole } from "@prisma/client";
import { z } from "zod";

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

  const course = await courses.getBySlug(slug);

  if (!course) {
    throw createError({
      status: 404,
      message: "Course not found",
    });
  }

  try {
    const deletedCourse = await courses.deleteById(course.id);
    return {
      message: "Course deleted",
    };
  } catch (e: any) {
    throw createError({
      status: 500,
      message: e.message,
    });
  }
});
