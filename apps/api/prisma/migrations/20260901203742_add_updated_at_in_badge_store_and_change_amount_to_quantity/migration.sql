/*
  Warnings:

  - You are about to drop the column `amount` on the `BadgeStore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BadgeStore" DROP COLUMN "amount",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
