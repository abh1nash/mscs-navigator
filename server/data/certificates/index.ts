import { db } from "../prisma";

export async function create(data: { name: string; description?: string }) {
  return await db.certificate.create({ data });
}

export async function update(
  id: string,
  data: { name: string; description?: string }
) {
  return await db.certificate.update({ where: { id }, data });
}

export async function deleteById(id: string) {
  return await db.certificate.delete({ where: { id } });
}

export async function getById(id: string) {
  return await db.certificate.findUnique({ where: { id } });
}

export async function filter(
  where: { id?: string; query?: string },
  skip: number = 0,
  take: number = 10
) {
  const builder = [];
  if (where.id) {
    builder.push({ id: { equals: where.id } });
  }

  if (where.query) {
    builder.push({
      OR: [
        { name: { contains: where.query } },
        { description: { contains: where.query } },
      ],
    });
  }

  const [data, total] = await db.$transaction([
    db.certificate.findMany({
      where: {
        AND: builder,
      },
      orderBy: {
        created: "desc",
      },
      skip,
      take,
    }),
    db.certificate.count({ where: { AND: builder } }),
  ]);

  return { data, total };
}
