import { db } from "../prisma";
import slugify from "slugify";

export async function create(data: {
  name: string;
  code?: string;
  prerequisites?: string;
  officialTimeEstimation?: number;
  officialDifficultyRating?: number;
  description?: string;
  difficulty?: number;
}) {
  return await db.course.create({
    data: {
      ...data,
      slug: slugify(data.name, { lower: true, remove: /[*+~.()'"!:@]/g }),
    },
  });
}

export async function getById(id: string) {
  return await db.course.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      prerequisites: true,
      officialDifficultyRating: true,
      officialTimeEstimation: true,
      specialization: true,
      certificates: true,
      created: true,
      updated: true,
    },
  });
}

export async function getBySlug(slug: string) {
  return await db.course.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      prerequisites: true,
      officialDifficultyRating: true,
      specialization: true,
      certificates: true,
      modules: true,
      created: true,
      updated: true,
    },
  });
}

export async function filter(
  where: { query?: string; certificateId?: string },
  skip: number = 0,
  take: number = 10
) {
  const builder = [];

  if (where.query) {
    builder.push({
      OR: [
        { name: { contains: where.query } },
        { description: { contains: where.query } },
      ],
    });
  }

  if (where.certificateId) {
    builder.push({
      certificates: {
        some: {
          id: where.certificateId,
        },
      },
    });
  }

  const [data, total] = await db.$transaction([
    db.course.findMany({
      where: {
        AND: builder,
      },
      orderBy: {
        created: "desc",
      },
      skip,
      take,
    }),
    db.course.count({ where: { AND: builder } }),
  ]);

  return { data, total };
}

export async function update(
  id: string,
  data: {
    name: string;
    code?: string;
    prerequisites?: string;
    officialTimeEstimation?: number;
    officialDifficultyRating?: number;
    description?: string;
    difficulty?: number;
  }
) {
  return await db.course.update({
    where: { id },
    data: {
      ...data,
      slug: slugify(data.name, { lower: true, remove: /[*+~.()'"!:@]/g }),
    },
  });
}

export async function deleteById(id: string) {
  return await db.course.delete({ where: { id } });
}
