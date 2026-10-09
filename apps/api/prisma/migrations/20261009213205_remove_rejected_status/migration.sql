/*
  Warnings:

  - The values [REJECTED] on the enum `ScoutDegreeTaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScoutDegreeTaskStatus_new" AS ENUM ('TODO', 'SUBMITTED', 'APPROVED');
ALTER TABLE "public"."ScoutDegreeTask" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ScoutDegreeTask" ALTER COLUMN "status" TYPE "ScoutDegreeTaskStatus_new" USING ("status"::text::"ScoutDegreeTaskStatus_new");
ALTER TYPE "ScoutDegreeTaskStatus" RENAME TO "ScoutDegreeTaskStatus_old";
ALTER TYPE "ScoutDegreeTaskStatus_new" RENAME TO "ScoutDegreeTaskStatus";
DROP TYPE "public"."ScoutDegreeTaskStatus_old";
ALTER TABLE "ScoutDegreeTask" ALTER COLUMN "status" SET DEFAULT 'TODO';
COMMIT;
