/*
  Warnings:

  - The `status` column on the `TestSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `endTime` to the `TestSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestSessionStatus" AS ENUM ('ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TestSessionStatus" NOT NULL DEFAULT 'ACTIVE';
