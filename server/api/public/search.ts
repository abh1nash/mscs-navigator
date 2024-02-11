import { z } from "zod";
import { CourseType, Prisma } from "@prisma/client";
import { db } from "~/server/data/prisma";

const querySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  certificate: z.string().optional(),
  type: z
    .nativeEnum(CourseType)
    .or(z.enum(["ALL"]))
    .optional(),
  timeMin: z.coerce.number().optional(),
  timeMax: z.coerce.number().optional(),
  officialDifficultyRating: z.coerce.number().min(0).max(5).optional(),
});
export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (q) => querySchema.safeParse(q));

  const builder = [];

  if (!query.success) {
    return { results: [], pagination: { total: 0 } };
  }

  if (query.data.query) {
    builder.push({
      OR: [
        {
          name: {
            contains: query.data.query,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: query.data.query,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          code: {
            contains: query.data.query,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          prerequisites: {
            contains: query.data.query,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    });
  }

  if (query.data.certificate) {
    builder.push({
      OR: [
        {
          certificates: {
            some: {
              certificateId: query.data.certificate,
            },
          },
        },
        {
          specialization: {
            certificates: {
              some: {
                certificateId: query.data.certificate,
              },
            },
          },
        },
      ],
    });
  }

  if (query.data.type && query.data.type !== "ALL") {
    builder.push({
      OR: [
        {
          certificates: {
            some: {
              type: query.data.type,
            },
          },
        },
        {
          specialization: {
            certificates: {
              some: {
                type: query.data.type,
              },
            },
          },
        },
      ],
    });
  }

  if (query.data.officialDifficultyRating) {
    builder.push({
      officialDifficultyRating: {
        gte: query.data.officialDifficultyRating,
      },
    });
  }

  if (query.data.timeMin || query.data.timeMax) {
    builder.push({
      officialTimeEstimation: {
        gte: query.data.timeMin || 0,
        lte: query.data.timeMax || 9999,
      },
    });
  }

  const [results, count] = await db.$transaction([
    db.course.findMany({
      where: {
        AND: builder,
      },
      skip: query.data.page
        ? (query.data.page - 1) * (query.data.limit || 10)
        : 0,
      take: query.data.limit || 10,
      select: {
        name: true,
        slug: true,
        officialDifficultyRating: true,
        officialTimeEstimation: true,
        certificates: {
          select: {
            type: true,
            certificate: true,
          },
        },
        specialization: {
          select: {
            name: true,
            slug: true,
            certificates: {
              select: {
                type: true,
                certificate: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
    db.course.count({
      where: {
        AND: builder,
      },
    }),
  ]);

  return { results, pagination: { total: count } };
});
