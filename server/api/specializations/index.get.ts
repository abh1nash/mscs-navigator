import * as specializations from "~/server/data/specializations";
import { z } from "zod";

const querySchema = z.object({
  query: z.string().optional(),
  certificateId: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export default defineEventHandler(async (event) => {
  const validParams = await getValidatedQuery(event, (q) =>
    querySchema.safeParse(q)
  );

  if (!validParams.success) {
    throw createError({
      statusCode: 400,
      message: validParams.error.issues[0].message,
    });
  }

  const results = await specializations.filter(
    {
      query: validParams.data.query,
      certificateId: validParams.data.certificateId,
    },
    ((validParams.data.page || 1) - 1) * (validParams.data.limit || 0),
    validParams.data.limit || 10
  );

  return { results: results.data, pagination: { total: results.total } };
});
