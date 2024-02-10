import { db } from "../prisma";

export async function create(data: {
  name: string;
  slug: string;
  code?: string;
  prerequisites?: string;
  officialTimeEstimation?: number;
  officialDifficultyRating?: number;
  description?: string;
  difficulty?: number;
}) {
  return db.course.create({
    data,
  });
}

export async function getById(id: string) {
  return db.course.findUnique({
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
  return db.course.findUnique({
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
    code?: string;
    prerequisites?: string;
    officialTimeEstimation?: number;
    officialDifficultyRating?: number;
    description?: string;
    difficulty?: number;
  }
) {
  return db.course.update({ where: { id }, data });
}

export async function deleteById(id: string) {
  return db.course.delete({ where: { id } });
}
