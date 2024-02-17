import * as courses from "~/server/data/courses";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const AUTHORIZED: UserRole[] = [
  UserRole.COURSE_AUDITOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

const bodySchema = z.object({
  name: z.string(),
  code: z.string().optional(),
  prerequisites: z.string().optional(),
  finalType: z.string(),
  officialTimeEstimation: z.number().optional(),
  officialDifficultyRating: z.number().optional(),
  description: z.string().optional(),
  difficulty: z.number().optional(),
});

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

  const validBody = await readValidatedBody(event, (b) =>
    bodySchema.safeParse(b)
  );

  if (!validBody.success) {
    throw createError({
      statusCode: 400,
      message: validBody.error.issues[0].message,
    });
  }

  try {
    const updatedCourse = await courses.update(course.id, validBody.data);
    return {
      message: "Course updated",
      slug: updatedCourse.slug,
    };
  } catch (e: any) {
    throw createError({
      status: 500,
      message: e.message,
    });
  }
});
