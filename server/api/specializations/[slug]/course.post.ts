import { z } from "zod";
import { UserRole } from "@prisma/client";
import * as specializations from "~/server/data/specializations";

const AUTHORIZED: UserRole[] = [
  UserRole.ADMIN,
  UserRole.COURSE_AUDITOR,
  UserRole.SUPER_ADMIN,
];

const bodySchema = z.object({
  courseId: z.string().min(1),
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

  const validBody = await readValidatedBody(event, (b) =>
    bodySchema.safeParse(b)
  );

  if (!validBody.success) {
    throw createError({
      statusCode: 400,
      message: validBody.error.issues[0].message,
    });
  }

  const specializationSlug = getRouterParam(event, "slug");

  if (!specializationSlug) {
    throw createError({
      statusCode: 400,
      message: "Specialization is required",
    });
  }

  const specialization = await specializations.getBySlug(specializationSlug);

  if (!specialization) {
    throw createError({
      statusCode: 404,
      message: "Specialization not found",
    });
  }

  try {
    await specializations.addCourse(specialization.id, validBody.data.courseId);
    return { message: "Course added to specialization" };
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      message: e.message || "Error processing the request",
    });
  }
});
