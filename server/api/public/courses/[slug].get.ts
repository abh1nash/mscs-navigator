import * as courses from "~/server/data/courses";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      status: 400,
    });
  }

  const course = await courses.getBySlug(slug);

  return course;
});
