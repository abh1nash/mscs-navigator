import { Argon2id } from "oslo/password";
import { db } from "~/server/data/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      message: "Email and password are required.",
      status: 400,
    });
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw createError({ message: "Invalid email or password.", status: 404 });
  }

  const validPassword = await new Argon2id().verify(user.password, password);

  if (!validPassword) {
    throw createError({ message: "Invalid email or password.", status: 404 });
  }

  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize()
  );

  return { message: "Logged in successfully." };
});
