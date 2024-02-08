/*
  Warnings:

  - You are about to drop the column `updatedById` on the `Specialization` table. All the data in the column will be lost.
  - You are about to drop the `CourseReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Degree` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpecializationReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToDegree` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DegreeToSpecialization` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "CourseType" ADD VALUE 'OTHER';

-- DropForeignKey
ALTER TABLE "CourseReview" DROP CONSTRAINT "CourseReview_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseReview" DROP CONSTRAINT "CourseReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpecializationReview" DROP CONSTRAINT "SpecializationReview_specializationId_fkey";

-- DropForeignKey
ALTER TABLE "SpecializationReview" DROP CONSTRAINT "SpecializationReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToDegree" DROP CONSTRAINT "_CourseToDegree_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourseToDegree" DROP CONSTRAINT "_CourseToDegree_B_fkey";

-- DropForeignKey
ALTER TABLE "_DegreeToSpecialization" DROP CONSTRAINT "_DegreeToSpecialization_A_fkey";

-- DropForeignKey
ALTER TABLE "_DegreeToSpecialization" DROP CONSTRAINT "_DegreeToSpecialization_B_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Specialization" DROP COLUMN "updatedById";

-- DropTable
DROP TABLE "CourseReview";

-- DropTable
DROP TABLE "Degree";

-- DropTable
DROP TABLE "SpecializationReview";

-- DropTable
DROP TABLE "_CourseToDegree";

-- DropTable
DROP TABLE "_DegreeToSpecialization";

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT,
    "timeTaken" DOUBLE PRECISION,
    "rating" INTEGER NOT NULL,
    "difficultyRating" INTEGER,
    "instructorRating" INTEGER,
    "specializationId" TEXT,
    "courseId" TEXT,
    "certificateId" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CertificateToSpecialization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToCourse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToSpecialization_AB_unique" ON "_CertificateToSpecialization"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToSpecialization_B_index" ON "_CertificateToSpecialization"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToCourse_AB_unique" ON "_CertificateToCourse"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToCourse_B_index" ON "_CertificateToCourse"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToSpecialization" ADD CONSTRAINT "_CertificateToSpecialization_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToSpecialization" ADD CONSTRAINT "_CertificateToSpecialization_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToCourse" ADD CONSTRAINT "_CertificateToCourse_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToCourse" ADD CONSTRAINT "_CertificateToCourse_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
