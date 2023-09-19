-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('GRAMMAR', 'READING', 'LISTENING');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "classYear" INTEGER NOT NULL DEFAULT 0,
    "isTeacher" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "languageLevel" INTEGER NOT NULL DEFAULT 0,
    "questionText" TEXT NOT NULL DEFAULT '',
    "rightAnswer" TEXT NOT NULL DEFAULT '',
    "wrongAnswers" TEXT[] DEFAULT ARRAY['', '', '']::TEXT[],
    "questionType" "QuestionType" NOT NULL DEFAULT 'GRAMMAR',
    "pointAmount" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "class" INTEGER NOT NULL,
    "timeLimit" INTEGER NOT NULL DEFAULT 0,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "grammarA1Amount" INTEGER NOT NULL DEFAULT 0,
    "grammarA2Amount" INTEGER NOT NULL DEFAULT 0,
    "grammarB1Amount" INTEGER NOT NULL DEFAULT 0,
    "grammarB2Amount" INTEGER NOT NULL DEFAULT 0,
    "grammarC1Amount" INTEGER NOT NULL DEFAULT 0,
    "grammarC2Amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSession" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "testId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GrammarQuestions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Test_class_key" ON "Test"("class");

-- CreateIndex
CREATE UNIQUE INDEX "TestSession_userId_key" ON "TestSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_GrammarQuestions_AB_unique" ON "_GrammarQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_GrammarQuestions_B_index" ON "_GrammarQuestions"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrammarQuestions" ADD CONSTRAINT "_GrammarQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GrammarQuestions" ADD CONSTRAINT "_GrammarQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "TestSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
