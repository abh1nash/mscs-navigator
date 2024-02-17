import { db } from "../prisma";

export async function create(data: {
  courseId?: string;
  specializationId?: string;
  certificateId?: string;
  userId: string;
  rating: number;
  timeTaken: number;
  difficultyRating?: number;
  instructorRating?: number;
  comment?: string;
}) {
  if (!data.courseId && !data.specializationId && !data.certificateId) {
    throw new Error("Missing courseId, specializationId, or certificateId");
  }

  // check if user has already rated this course
  const existingRating = await db.review.findFirst({
    where: {
      courseId: data.courseId,
      specializationId: data.specializationId,
      certificateId: data.certificateId,
      userId: data.userId,
    },
  });

  if (existingRating) {
    throw new Error("User has already rated this course");
  }

  const review = await db.review.create({
    data: {
      courseId: data.courseId,
      specializationId: data.specializationId,
      certificateId: data.certificateId,
      userId: data.userId,
      rating: data.rating,
      timeTaken: data.timeTaken,
      difficultyRating: data.difficultyRating,
      instructorRating: data.instructorRating,
      comment: data.comment,
    },
  });

  // update avg rating in course, specialization, or certificate
  const [avgRating] = await db.$transaction([
    db.review.aggregate({
      _avg: {
        rating: true,
        instructorRating: true,
        difficultyRating: true,
        timeTaken: true,
      },
      where: {
        courseId: data.courseId,
      },
    }),
    // db.review.aggregate({
    //   _avg: {
    //     rating: true,
    //     instructorRating: true,
    //     difficultyRating: true,
    //   },
    //   where: {
    //     specializationId: data.specializationId,
    //   },
    // }),
    // db.review.aggregate({
    //   _avg: {
    //     rating: true,
    //     instructorRating: true,
    //     difficultyRating: true,
    //   },
    //   where: {
    //     certificateId: data.certificateId,
    //   },
    // }),
  ]);

  if (data.courseId) {
    await db.course.update({
      where: {
        id: data.courseId,
      },
      data: {
        avgRating: avgRating._avg.rating,
        avgInstructorRating: avgRating._avg.instructorRating,
        avgDifficultyRating: avgRating._avg.difficultyRating,
        avgTimeTaken: avgRating._avg.timeTaken,
      },
    });
  }

  return review;
}

export async function get(
  filter: {
    courseId?: string;
    specializationId?: string;
    certificateId?: string;
    userId?: string;
  },
  skip: number,
  take: number
) {
  const [data, total] = await db.$transaction([
    db.review.findMany({
      where: {
        courseId: filter.courseId,
        specializationId: filter.specializationId,
        certificateId: filter.certificateId,
        userId: filter.userId,
      },
      orderBy: {
        created: "desc",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
      },
      skip,
      take,
    }),
    db.review.count({
      where: {
        courseId: filter.courseId,
        specializationId: filter.specializationId,
        certificateId: filter.certificateId,
      },
    }),
  ]);
  return { data, total };
}
