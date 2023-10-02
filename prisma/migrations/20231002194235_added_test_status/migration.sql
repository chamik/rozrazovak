/*
  Warnings:

  - You are about to drop the column `started` on the `Test` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('IDLE', 'ACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "started",
ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'IDLE';

-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'IDLE';
