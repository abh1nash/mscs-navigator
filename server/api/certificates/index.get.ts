import { UserRole } from "@prisma/client";
import { z } from "zod";
import * as certificates from "~/server/data/certificates";

const AUTHORIZED: UserRole[] = [
  UserRole.ADMIN,
  UserRole.COURSE_AUDITOR,
  UserRole.SUPER_ADMIN,
];

const querySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
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

  const validParams = await getValidatedQuery(event, (q) =>
    querySchema.safeParse(q)
  );

  if (!validParams.success) {
    throw createError({
      statusCode: 400,
      message: validParams.error.issues[0].message,
    });
  }

  const filteredCertificates = await certificates.filter(
    {
      query: validParams.data.query,
    },
    ((validParams.data.page || 1) - 1) * (validParams.data.limit || 0),
    validParams.data.limit || 10
  );
  return {
    results: filteredCertificates.data,
    pagination: {
      total: filteredCertificates.total,
    },
  };
});
