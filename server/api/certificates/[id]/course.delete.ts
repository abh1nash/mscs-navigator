import { z } from "zod";
import { UserRole } from "@prisma/client";
import * as certificates from "~/server/data/certificates";

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

  const certificateId = getRouterParam(event, "id");

  if (!certificateId) {
    throw createError({
      statusCode: 400,
      message: "Certificate is required",
    });
  }

  try {
    await certificates.removeCourse(certificateId, validBody.data.courseId);
    return { message: "Course removed from the certificate" };
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      message: e.message || "Error processing the request",
    });
  }
});
