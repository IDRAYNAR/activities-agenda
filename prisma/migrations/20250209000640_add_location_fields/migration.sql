/*
  Warnings:

  - Added the required column `address` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
