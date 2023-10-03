-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "correctAnswers" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "wrongAnswers" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
