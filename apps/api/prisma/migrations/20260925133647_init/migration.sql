-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'EXCUSED');

-- CreateEnum
CREATE TYPE "BadgeStatus" AS ENUM ('PLANNED', 'COMPLETED', 'WON');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Function" AS ENUM ('DRUZYNOWY', 'PRZYBOCZNY', 'ZASTEPOWY', 'PODZASTEPOWY', 'NONE');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('HARCMISTRZ', 'PODHARCMISTRZ', 'PRZEWODNIK', 'NONE');

-- CreateEnum
CREATE TYPE "Degree" AS ENUM ('HR', 'HO', 'CW', 'WYW', 'ML', 'DH', 'NONE');

-- CreateEnum
CREATE TYPE "InventoryItemType" AS ENUM ('UNIFORM', 'EQUIPMENT');

-- CreateTable
CREATE TABLE "ScoutYear" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "ScoutYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "authUserId" UUID,
    "email" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "pesel" TEXT,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "troopId" UUID NOT NULL,
    "patrolId" UUID,
    "rank" "Rank" NOT NULL DEFAULT 'NONE',
    "degree" "Degree" NOT NULL DEFAULT 'NONE',
    "function" "Function" NOT NULL DEFAULT 'NONE',
    "acquiringDegree" "Degree" NOT NULL DEFAULT 'NONE',
    "hasNaramiennik" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ScoutProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "profileId" UUID NOT NULL,
    "badgeId" TEXT NOT NULL,
    "status" "BadgeStatus" NOT NULL DEFAULT 'PLANNED',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("profileId","badgeId")
);

-- CreateTable
CREATE TABLE "ScoutNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "authorId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoutNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutTroop" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ScoutTroop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutPatrol" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "troopId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "assemblyDay" INTEGER,
    "assemblyTime" TEXT,

    CONSTRAINT "ScoutPatrol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgeStore" (
    "troopId" UUID NOT NULL,
    "badgeId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BadgeStore_pkey" PRIMARY KEY ("troopId","badgeId")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "troopId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "InventoryItemType" NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "troopId" UUID NOT NULL,
    "scoutYearId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "eventId" UUID NOT NULL,
    "scoutId" UUID NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("eventId","scoutId")
);

-- CreateTable
CREATE TABLE "_UserParents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserParents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScoutYear_name_key" ON "ScoutYear"("name");

-- CreateIndex
CREATE INDEX "ScoutYear_startDate_endDate_idx" ON "ScoutYear"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_authUserId_key" ON "User"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_pesel_key" ON "User"("pesel");

-- CreateIndex
CREATE UNIQUE INDEX "ScoutProfile_userId_key" ON "ScoutProfile"("userId");

-- CreateIndex
CREATE INDEX "ScoutProfile_troopId_idx" ON "ScoutProfile"("troopId");

-- CreateIndex
CREATE INDEX "ScoutProfile_patrolId_idx" ON "ScoutProfile"("patrolId");

-- CreateIndex
CREATE INDEX "ScoutProfile_function_idx" ON "ScoutProfile"("function");

-- CreateIndex
CREATE INDEX "ScoutProfile_troopId_patrolId_idx" ON "ScoutProfile"("troopId", "patrolId");

-- CreateIndex
CREATE INDEX "UserBadge_profileId_status_idx" ON "UserBadge"("profileId", "status");

-- CreateIndex
CREATE INDEX "ScoutNote_profileId_createdAt_idx" ON "ScoutNote"("profileId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ScoutPatrol_troopId_idx" ON "ScoutPatrol"("troopId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoutPatrol_troopId_name_key" ON "ScoutPatrol"("troopId", "name");

-- CreateIndex
CREATE INDEX "Event_troopId_scoutYearId_startDate_idx" ON "Event"("troopId", "scoutYearId", "startDate");

-- CreateIndex
CREATE INDEX "_UserParents_B_index" ON "_UserParents"("B");

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "ScoutProfile_patrolId_fkey" FOREIGN KEY ("patrolId") REFERENCES "ScoutPatrol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "ScoutProfile_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "ScoutProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ScoutProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutNote" ADD CONSTRAINT "ScoutNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutNote" ADD CONSTRAINT "ScoutNote_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ScoutProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutPatrol" ADD CONSTRAINT "ScoutPatrol_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeStore" ADD CONSTRAINT "BadgeStore_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_scoutYearId_fkey" FOREIGN KEY ("scoutYearId") REFERENCES "ScoutYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "ScoutProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserParents" ADD CONSTRAINT "_UserParents_A_fkey" FOREIGN KEY ("A") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserParents" ADD CONSTRAINT "_UserParents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
