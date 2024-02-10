import { db } from "../prisma";
import { CourseType } from "@prisma/client";

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
  return await db.certificate.findUnique({
    where: { id },
    include: {
      courses: {
        include: {
          course: true,
        },
      },
      specializations: {
        include: {
          specialization: true,
        },
      },
    },
  });
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

export async function addCourse(
  certificateId: string,
  courseId: string,
  type: CourseType
) {
  const certificate = await db.certificate.findUnique({
    where: { id: certificateId },
    include: { courses: true },
  });
  if (!certificate) {
    throw new Error("Certificate not found");
  }

  const existingEntry = await db.certificateCourse.findFirst({
    where: {
      certificateId,
      courseId,
    },
  });

  if (existingEntry) {
    throw new Error("Course already added to certificate");
  }

  return await db.certificateCourse.create({
    data: {
      certificateId,
      courseId,
      type,
    },
  });
}

export async function addSpecialization(
  certificateId: string,
  specializationId: string,
  type: CourseType
) {
  const specialization = await db.specialization.findUnique({
    where: { id: specializationId },
  });
  if (!specialization) {
    throw new Error("Specialization not found");
  }
  const certificate = await db.certificate.findUnique({
    where: { id: certificateId },
    include: { specializations: true },
  });
  if (!certificate) {
    throw new Error("Certificate not found");
  }

  const existingEntry = await db.certificateSpecialization.findFirst({
    where: {
      certificateId,
      specializationId,
    },
  });
  if (existingEntry) {
    throw new Error("Specialization already added to certificate");
  }

  return await db.certificateSpecialization.create({
    data: {
      certificateId,
      specializationId,
      type,
    },
  });
}

export async function removeCourse(certificateId: string, courseId: string) {
  return await db.certificateCourse.deleteMany({
    where: { certificateId, courseId },
  });
}

export async function removeSpecialization(
  certificateId: string,
  specializationId: string
) {
  return await db.certificateSpecialization.deleteMany({
    where: {
      certificateId,
      specializationId,
    },
  });
}
