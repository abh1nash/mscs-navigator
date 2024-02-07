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
  });
}

export async function getById(id: string) {
  return db.user.findUnique({
    where: { id },
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
