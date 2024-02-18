import { db } from "../prisma";

export async function updateAverageRating(where: {
  courseId?: string;
  specializationId?: string;
  certificateId?: string;
}) {
  if (where.courseId) {
    const courseAvg = await db.review.aggregate({
      _avg: {
        rating: true,
        instructorRating: true,
        difficultyRating: true,
        timeTaken: true,
      },
      where: {
        courseId: where.courseId,
      },
    });
    await db.course.update({
      where: {
        id: where.courseId,
      },
      data: {
        avgRating: courseAvg._avg.rating,
        avgInstructorRating: courseAvg._avg.instructorRating,
        avgDifficultyRating: courseAvg._avg.difficultyRating,
        avgTimeTaken: courseAvg._avg.timeTaken,
      },
    });
  }

  if (where.specializationId) {
    const specializationAvg = await db.review.aggregate({
      _avg: {
        rating: true,
        instructorRating: true,
        difficultyRating: true,
      },
      where: {
        specializationId: where.specializationId,
      },
    });
    await db.specialization.update({
      where: {
        id: where.specializationId,
      },
      data: {
        avgRating: specializationAvg._avg.rating,
        avgInstructorRating: specializationAvg._avg.instructorRating,
        avgDifficultyRating: specializationAvg._avg.difficultyRating,
      },
    });
  }

  if (where.certificateId) {
    const certificateAvg = await db.review.aggregate({
      _avg: {
        rating: true,
        instructorRating: true,
        difficultyRating: true,
      },
      where: {
        certificateId: where.certificateId,
      },
    });
    await db.certificate.update({
      where: {
        id: where.certificateId,
      },
      data: {
        avgRating: certificateAvg._avg.rating,
        avgInstructorRating: certificateAvg._avg.instructorRating,
        avgDifficultyRating: certificateAvg._avg.difficultyRating,
      },
    });
  }
}

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
  await updateAverageRating({
    courseId: data.courseId,
    specializationId: data.specializationId,
    certificateId: data.certificateId,
  });

  return review;
}

export async function deleteById(id: string) {
  const review = await db.review.findUnique({
    where: {
      id,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  await db.review.delete({
    where: {
      id,
    },
  });

  // update avg rating in course, specialization, or certificate
  await updateAverageRating({
    courseId: review.courseId || undefined,
    specializationId: review.specializationId || undefined,
    certificateId: review.certificateId || undefined,
  });
}

export async function update(
  id: string,
  data: {
    comment: string;
    instructorRating: number;
    difficultyRating: number;
    rating: number;
    timeTaken: number;
  }
) {
  const review = await db.review.findUnique({
    where: {
      id,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  const updatedReview = await db.review.update({
    where: {
      id,
    },
    data: {
      comment: data.comment,
      instructorRating: data.instructorRating,
      difficultyRating: data.difficultyRating,
      rating: data.rating,
    },
  });

  // update avg rating in course, specialization, or certificate
  await updateAverageRating({
    courseId: review.courseId || undefined,
    specializationId: review.specializationId || undefined,
    certificateId: review.certificateId || undefined,
  });

  return updatedReview;
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
