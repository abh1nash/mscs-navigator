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
      created: true,
      updated: true,
    },
  });
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
