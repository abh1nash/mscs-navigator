import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateId } from "lucia";
import { db } from "../prisma";

export async function create(userId: string) {
  const prevTokens = await db.resetToken.findMany({
    where: { userId },
  });
  if (prevTokens.length > 0) {
    db.resetToken.deleteMany({
      where: { userId },
    });
  }

  const newToken = generateId(40);

  await db.resetToken.create({
    data: {
      token: newToken,
      userId,
      expiresAt: createDate(new TimeSpan(1, "h")),
    },
  });

  return newToken;
}

export async function validate(token: string) {
  const resetToken = await db.resetToken.findUnique({
    where: { token },
  });

  if (!resetToken || !isWithinExpirationDate(resetToken.expiresAt)) {
    return null;
  }

  return resetToken;
}

export async function consume(token: string) {
  await db.resetToken.delete({
    where: { token },
  });
}
