import { z } from "zod";
import * as courses from "~/server/data/courses";
import * as reviews from "~/server/data/reviews";

const bodySchema = z.object({
  rating: z.number().min(0).max(5),
  timeTaken: z.number().min(1),
  difficultyRating: z.number().min(0).max(5).optional(),
  instructorRating: z.number().min(0).max(5).optional(),
  comment: z.string().optional(),
});
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      status: 400,
      message: "Missing slug",
    });
  }
  const user = event.context.user;
  if (!user) {
    throw createError({
      status: 401,
      message: "Unauthorized",
    });
  }
  const course = await courses.getBySlug(slug);
  if (!course) {
    throw createError({
      status: 404,
      message: "Course not found",
    });
  }
  const validBody = await readValidatedBody(event, (b) =>
    bodySchema.safeParse(b)
  );
  if (!validBody.success) {
    throw createError({
      statusCode: 400,
      message: validBody.error.issues[0].message,
    });
  }
  try {
    await reviews.create({
      courseId: course.id,
      userId: user.id,
      rating: validBody.data.rating,
      timeTaken: validBody.data.timeTaken,
      difficultyRating: validBody.data.difficultyRating,
      instructorRating: validBody.data.instructorRating,
      comment: validBody.data.comment,
    });
    return {
      message: "Review created",
    };
  } catch (e: any) {
    throw createError({
      status: 500,
      message: e.message,
    });
  }
});
