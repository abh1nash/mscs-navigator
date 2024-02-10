import { db } from "../prisma";

export async function create(data: {
  name: string;
  slug: string;
  description?: string;
  difficulty?: number;
}) {
  return db.specialization.create({
    data,
  });
}

export async function getById(id: string) {
  return db.specialization.findUnique({
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
  return db.specialization.findUnique({
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

export async function update(
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    difficulty?: number;
  }
) {
  return db.specialization.update({ where: { id }, data });
}

export async function deleteById(id: string) {
  return db.specialization.delete({ where: { id } });
}
