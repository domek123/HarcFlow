/*
  Warnings:

  - The primary key for the `UserBadge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `wonAt` on the `UserBadge` table. All the data in the column will be lost.
  - You are about to drop the `BadgesStore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeritBadge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BadgesStore" DROP CONSTRAINT "BadgesStore_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "BadgesStore" DROP CONSTRAINT "BadgesStore_troopId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";

-- DropIndex
DROP INDEX "UserBadge_profileId_badgeId_key";

-- DropIndex
DROP INDEX "UserBadge_wonAt_idx";

-- AlterTable
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_pkey",
DROP COLUMN "wonAt",
ALTER COLUMN "badgeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("profileId", "badgeId");

-- DropTable
DROP TABLE "BadgesStore";

-- DropTable
DROP TABLE "MeritBadge";

-- CreateTable
CREATE TABLE "BadgeStore" (
    "troopId" UUID NOT NULL,
    "badgeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BadgeStore_pkey" PRIMARY KEY ("troopId","badgeId")
);

-- AddForeignKey
ALTER TABLE "BadgeStore" ADD CONSTRAINT "BadgeStore_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
