/*
  Warnings:

  - You are about to drop the column `type` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `_CertificateToCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CertificateToSpecialization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CertificateToCourse" DROP CONSTRAINT "_CertificateToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToCourse" DROP CONSTRAINT "_CertificateToCourse_B_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToSpecialization" DROP CONSTRAINT "_CertificateToSpecialization_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToSpecialization" DROP CONSTRAINT "_CertificateToSpecialization_B_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "type";

-- DropTable
DROP TABLE "_CertificateToCourse";

-- DropTable
DROP TABLE "_CertificateToSpecialization";

-- CreateTable
CREATE TABLE "CertificateCourse" (
    "id" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" "CourseType" NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificateSpecialization" (
    "id" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateSpecialization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CertificateCourse" ADD CONSTRAINT "CertificateCourse_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateCourse" ADD CONSTRAINT "CertificateCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateSpecialization" ADD CONSTRAINT "CertificateSpecialization_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateSpecialization" ADD CONSTRAINT "CertificateSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
