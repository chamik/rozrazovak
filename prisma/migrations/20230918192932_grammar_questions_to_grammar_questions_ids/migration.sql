/*
  Warnings:

  - You are about to drop the `_GrammarQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GrammarQuestions" DROP CONSTRAINT "_GrammarQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_GrammarQuestions" DROP CONSTRAINT "_GrammarQuestions_B_fkey";

-- AlterTable
ALTER TABLE "TestSession" ADD COLUMN     "grammarQuestionsIds" INTEGER[];

-- DropTable
DROP TABLE "_GrammarQuestions";
