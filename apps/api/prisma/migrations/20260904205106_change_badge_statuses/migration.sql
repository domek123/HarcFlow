/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `BadgeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BadgeStatus_new" AS ENUM ('PLANNED', 'COMPLETED', 'WON');
ALTER TABLE "public"."UserBadge" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "UserBadge" ALTER COLUMN "status" TYPE "BadgeStatus_new" USING ("status"::text::"BadgeStatus_new");
ALTER TYPE "BadgeStatus" RENAME TO "BadgeStatus_old";
ALTER TYPE "BadgeStatus_new" RENAME TO "BadgeStatus";
DROP TYPE "public"."BadgeStatus_old";
ALTER TABLE "UserBadge" ALTER COLUMN "status" SET DEFAULT 'PLANNED';
COMMIT;
