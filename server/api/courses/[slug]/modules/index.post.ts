import { z } from "zod";
import { UserRole } from "@prisma/client";
import * as modules from "~/server/data/modules";

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const AUTHORIZED: UserRole[] = [
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

  const validBody = await readValidatedBody(event, (b) =>
    bodySchema.safeParse(b)
  );

  if (!validBody.success) {
    throw createError({
      statusCode: 400,
      message: validBody.error.issues[0].message,
    });
  }

  const courseSlug = getRouterParam(event, "slug");

  if (!courseSlug) {
    throw createError({
      statusCode: 400,
      message: "Course is required",
    });
  }

  try {
    const module = await modules.create(courseSlug, validBody.data);
    return {
      message: "Module created",
      moduleId: module.id,
    };
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      message: err.message,
    });
  }
});
