/*
  Warnings:

  - Added the required column `successRate` to the `TestSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "successRate" DOUBLE PRECISION NOT NULL;
