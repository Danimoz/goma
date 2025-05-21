/*
  Warnings:

  - You are about to drop the column `endDate` on the `AcademicSession` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `AcademicSession` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Term` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Term` table. All the data in the column will be lost.
  - Added the required column `endYear` to the `AcademicSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `AcademicSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicSession" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "endYear" TEXT NOT NULL,
ADD COLUMN     "startYear" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Term" DROP COLUMN "endDate",
DROP COLUMN "startDate";
