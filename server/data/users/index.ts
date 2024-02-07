import { db } from "../prisma";
import { UserRole } from "@prisma/client";

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
  return db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
      role: role || UserRole.STUDENT,
    },
  });
}

export async function getById(id: string) {
  return db.user.findUnique({
    where: { id },
  });
}

export async function updatePassword(userId: string, password: string) {
  await db.user.update({
    where: { id: userId },
    data: {
      password,
    },
  });
}
