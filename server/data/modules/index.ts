import { db } from "../prisma";

export async function create(
  courseSlug: string,
  data: {
    name: string;
    description?: string;
  }
) {
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
  });

  if (!course) {
    throw new Error("Course not found");
  }
  return await db.module.create({ data: { ...data, courseId: course.id } });
}

export async function update(
  id: string,
  data: { name: string; description?: string }
) {
  return await db.module.update({
    where: { id },
    data,
  });
}

export async function deleteById(id: string) {
  return await db.module.delete({ where: { id } });
}
