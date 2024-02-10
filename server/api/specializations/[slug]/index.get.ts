import * as specializations from "~/server/data/specializations";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      status: 400,
      message: "Missing slug",
    });
  }

  const specialization = await specializations.getBySlug(slug);

  if (!specialization) {
    throw createError({
      status: 404,
      message: "Specialization not found",
    });
  }

  return specialization;
});
