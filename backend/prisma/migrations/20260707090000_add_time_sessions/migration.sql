-- CreateEnum
CREATE TYPE "TimeSessionStatus" AS ENUM ('RUNNING', 'PAUSED', 'COMPLETED');

-- CreateTable
CREATE TABLE "TimeSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "pausedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "status" "TimeSessionStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimeSession_userId_idx" ON "TimeSession"("userId");

-- CreateIndex
CREATE INDEX "TimeSession_taskId_idx" ON "TimeSession"("taskId");

-- CreateIndex
CREATE INDEX "TimeSession_status_idx" ON "TimeSession"("status");

-- CreateIndex
CREATE INDEX "TimeSession_userId_status_idx" ON "TimeSession"("userId", "status");

-- AddForeignKey
ALTER TABLE "TimeSession" ADD CONSTRAINT "TimeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSession" ADD CONSTRAINT "TimeSession_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
