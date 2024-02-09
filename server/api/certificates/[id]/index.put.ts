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
    const updatedCertificate = await certificates.update(id, {
      name: validBody.data.name,
      description: validBody.data.description,
    });

    return {
      message: "Certificate updated",
      certificateId: updatedCertificate.id,
    };
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: "Unable to update",
    });
  }
});
