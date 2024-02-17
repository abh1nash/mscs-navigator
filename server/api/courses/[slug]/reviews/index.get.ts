import { z } from "zod";
import * as courses from "~/server/data/courses";
import * as reviews from "~/server/data/reviews";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).optional(),
});

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      status: 400,
      message: "Missing slug",
    });
  }
  const course = await courses.getBySlug(slug);
  if (!course) {
    throw createError({
      status: 404,
      message: "Course not found",
    });
  }
  const query = await getValidatedQuery(event, (q) => querySchema.safeParse(q));
  if (!query.success) {
    throw createError({
      status: 400,
      message: query.error.issues[0].message,
    });
  }
  const limit = query.data.limit ?? 10;
  const page = query?.data.page ?? 1;

  const skip = (page - 1) * limit;

  const { data, total } = await reviews.get(
    { courseId: course.id },
    skip,
    limit
  );
  return {
    results: data.map((review) => ({
      ...review,
      user: {
        id: review.user.id,
        name: `${review.user.firstName} ${review.user.lastName.charAt(0)}.`,
      },
    })),
    pagination: { total },
  };
});
