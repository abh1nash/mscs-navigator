/*
  Warnings:

  - Added the required column `type` to the `CertificateSpecialization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CertificateSpecialization" ADD COLUMN     "type" "CourseType" NOT NULL;
