/*
  Warnings:

  - A unique constraint covering the columns `[platform,userId]` on the table `SocialMediaHabit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_password_key";

-- AlterTable
ALTER TABLE "SocialMediaLog" ADD COLUMN     "activity" TEXT,
ADD COLUMN     "mood" TEXT,
ADD COLUMN     "wasProductive" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaHabit_platform_userId_key" ON "SocialMediaHabit"("platform", "userId");
