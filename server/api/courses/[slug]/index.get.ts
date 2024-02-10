import * as courses from "~/server/data/courses";

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

  return course;
});
