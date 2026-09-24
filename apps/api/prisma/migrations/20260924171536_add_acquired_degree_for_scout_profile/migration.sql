/*
  Warnings:

  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Attendance` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Attendance_eventId_scoutId_key";

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("eventId", "scoutId");

-- AlterTable
ALTER TABLE "ScoutProfile" ADD COLUMN     "acquiringDegree" "Degree" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
