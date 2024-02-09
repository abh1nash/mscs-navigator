import * as certificates from "~/server/data/certificates";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const AUTHORIZED: UserRole[] = [
  UserRole.ADMIN,
  UserRole.COURSE_AUDITOR,
  UserRole.SUPER_ADMIN,
];

const bodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
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

  try {
    const newCertificate = await certificates.create(validBody.data);
    return { message: "Certificate created", certificateId: newCertificate.id };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: "Unable to create certificate",
    });
  }
});
