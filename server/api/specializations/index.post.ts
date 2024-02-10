import * as specializations from "~/server/data/specializations";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const AUTHORIZED: UserRole[] = [
  UserRole.COURSE_AUDITOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

const bodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  difficulty: z.number().optional(),
});

export default defineEventHandler(async (event) => {
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
    const newSpecialization = await specializations.create(validBody.data);
    return {
      message: "Specialization created",
      slug: newSpecialization.slug,
    };
  } catch (e: any) {
    throw createError({
      status: 500,
      message: e.message,
    });
  }
});
