-- AlterTable
ALTER TABLE "User" ADD COLUMN     "approved" BOOLEAN,
ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false;
