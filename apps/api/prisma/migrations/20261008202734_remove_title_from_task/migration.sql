/*
  Warnings:

  - You are about to drop the column `templateTaskId` on the `ScoutDegreeTask` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ScoutDegreeTask` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ScoutDegreeStatus" ADD VALUE 'PREPARED';

-- DropForeignKey
ALTER TABLE "ScoutDegreeTask" DROP CONSTRAINT "ScoutDegreeTask_templateTaskId_fkey";

-- DropIndex
DROP INDEX "ScoutDegreeTask_templateTaskId_idx";

-- AlterTable
ALTER TABLE "ScoutDegree" ALTER COLUMN "status" SET DEFAULT 'PREPARED',
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ScoutDegreeTask" DROP COLUMN "templateTaskId",
DROP COLUMN "title";
