import { db } from "../prisma";
import slugify from "slugify";

export async function create(data: {
  name: string;
  description?: string;
  difficulty?: number;
}) {
  return await db.specialization.create({
    data: {
      ...data,
      slug: slugify(data.name, { lower: true, remove: /[*+~.()'"!:@]/g }),
    },
  });
}

export async function getById(id: string) {
  return await db.specialization.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      courses: true,
      created: true,
      updated: true,
    },
  });
}

export async function getBySlug(slug: string) {
  return await db.specialization.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      courses: true,
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
    db.specialization.findMany({
      where: {
        AND: builder,
      },
      orderBy: {
        created: "desc",
      },
      skip,
      take,
    }),
    db.specialization.count({ where: { AND: builder } }),
  ]);

  return { data, total };
}

export async function addCourse(specializationId: string, courseId: string) {
  return await db.specialization.update({
    where: { id: specializationId },
    data: {
      courses: {
        connect: {
          id: courseId,
        },
      },
    },
  });
}

export async function removeCourse(specializationId: string, courseId: string) {
  return await db.specialization.update({
    where: { id: specializationId },
    data: {
      courses: {
        disconnect: {
          id: courseId,
        },
      },
    },
  });
}

export async function update(
  id: string,
  data: {
    name: string;
    description?: string;
    difficulty?: number;
  }
) {
  return await db.specialization.update({ where: { id }, data });
}

export async function deleteById(id: string) {
  return await db.specialization.delete({ where: { id } });
}
