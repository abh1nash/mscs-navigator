import { db } from "../prisma";

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
