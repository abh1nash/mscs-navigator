import { db } from "../prisma";
import { UserRole } from "@prisma/client";
import { Argon2id } from "oslo/password";

export async function create({
  firstName,
  lastName,
  email,
  password,
  role,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}) {
  const hashedPassword = await new Argon2id().hash(password);
  return db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || UserRole.STUDENT,
    },
    select: {
      id: true,
      password: false,
    },
  });
}

export async function getById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      created: true,
      updated: true,
    },
  });
}

export async function filter(
  where: { id?: string; role?: UserRole; query?: string },
  skip: number = 0,
  take: number = 10
) {
  const builder = [];
  if (where.id) {
    builder.push({ id: { equals: where.id } });
  }

  if (where.role) {
    builder.push({ role: { equals: where.role } });
  }
  if (where.query) {
    builder.push({
      OR: [
        { email: { contains: where.query || "" } },
        { firstName: { contains: where.query || "" } },
        { lastName: { contains: where.query || "" } },
      ],
    });
  }

  const [data, total] = await db.$transaction([
    db.user.findMany({
      where: {
        AND: builder,
      },
      orderBy: {
        created: "desc",
      },
      skip,
      take,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        created: true,
        updated: true,
      },
    }),
    db.user.count({
      where: {
        AND: builder,
      },
    }),
  ]);
  return { data, total };
}

export async function update(
  id: string,
  data: { firstName: string; lastName: string; email: string; role: UserRole }
) {
  return db.user.update({
    where: { id },
    data,
    select: {
      id: true,
      password: false,
    },
  });
}

export async function deleteById(id: string) {
  return db.user.delete({
    where: { id },
    select: {
      id: true,
      password: false,
    },
  });
}

export async function updatePassword(userId: string, password: string) {
  const hashedPassword = await new Argon2id().hash(password);
  await db.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
}
