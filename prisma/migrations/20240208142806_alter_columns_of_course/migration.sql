/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `studentTimeEstimation` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "difficulty",
DROP COLUMN "studentTimeEstimation",
ADD COLUMN     "officialDifficultyRating" DOUBLE PRECISION;
