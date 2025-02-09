/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ActivityType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `ActivityType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityType" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ActivityType_name_key" ON "ActivityType"("name");
