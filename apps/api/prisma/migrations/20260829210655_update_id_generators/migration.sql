-- CreateEnum
CREATE TYPE "BadgeStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');

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
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "phoneNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "pesel" TEXT,
    "gender" "Gender" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "rank" "Rank" NOT NULL DEFAULT 'NONE',
    "degree" "Degree" NOT NULL DEFAULT 'NONE',
    "function" "Function" NOT NULL DEFAULT 'NONE',
    "hasNaramiennik" BOOLEAN NOT NULL DEFAULT false,
    "troopId" UUID NOT NULL,
    "patrolId" UUID,

    CONSTRAINT "ScoutProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "profileId" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "status" "BadgeStatus" NOT NULL DEFAULT 'PLANNED',
    "wonAt" TIMESTAMP(3),

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("profileId","badgeId")
);

-- CreateTable
CREATE TABLE "ScoutNote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" UUID NOT NULL,
    "profileId" UUID NOT NULL,

    CONSTRAINT "ScoutNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutTroop" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creationYear" INTEGER,

    CONSTRAINT "ScoutTroop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutPatrol" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "assemblyDay" INTEGER NOT NULL,
    "assemblyTime" TEXT NOT NULL,
    "troopId" UUID NOT NULL,

    CONSTRAINT "ScoutPatrol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BadgesStore" (
    "troopId" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BadgesStore_pkey" PRIMARY KEY ("troopId","badgeId")
);

-- CreateTable
CREATE TABLE "MeritBadge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "MeritBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "troopId" UUID NOT NULL,
    "type" "InventoryItemType" NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserParents" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_UserParents_AB_pkey" PRIMARY KEY ("A","B")
);

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
CREATE INDEX "UserBadge_wonAt_idx" ON "UserBadge"("wonAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_profileId_badgeId_key" ON "UserBadge"("profileId", "badgeId");

-- CreateIndex
CREATE INDEX "ScoutNote_profileId_createdAt_idx" ON "ScoutNote"("profileId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ScoutPatrol_troopId_idx" ON "ScoutPatrol"("troopId");

-- CreateIndex
CREATE INDEX "_UserParents_B_index" ON "_UserParents"("B");

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "ScoutProfile_patrolId_fkey" FOREIGN KEY ("patrolId") REFERENCES "ScoutPatrol"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "ScoutProfile_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutProfile" ADD CONSTRAINT "ScoutProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "MeritBadge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ScoutProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutNote" ADD CONSTRAINT "ScoutNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutNote" ADD CONSTRAINT "ScoutNote_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ScoutProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutPatrol" ADD CONSTRAINT "ScoutPatrol_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgesStore" ADD CONSTRAINT "BadgesStore_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "MeritBadge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgesStore" ADD CONSTRAINT "BadgesStore_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserParents" ADD CONSTRAINT "_UserParents_A_fkey" FOREIGN KEY ("A") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserParents" ADD CONSTRAINT "_UserParents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
