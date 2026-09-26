-- CreateEnum
CREATE TYPE "ScoutDegreeStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ScoutDegreeTaskStatus" AS ENUM ('TODO', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ScoutDegreeTaskSource" AS ENUM ('TEMPLATE', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "DegreeTemplate" (
    "id" UUID NOT NULL,
    "troopId" UUID NOT NULL,
    "degree" "Degree" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DegreeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DegreeTemplateTask" (
    "id" UUID NOT NULL,
    "degreeId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DegreeTemplateTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutDegree" (
    "id" UUID NOT NULL,
    "scoutId" UUID NOT NULL,
    "degreeId" UUID NOT NULL,
    "status" "ScoutDegreeStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoutDegree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoutDegreeTask" (
    "id" UUID NOT NULL,
    "scoutDegreeId" UUID NOT NULL,
    "templateTaskId" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "source" "ScoutDegreeTaskSource" NOT NULL,
    "status" "ScoutDegreeTaskStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScoutDegreeTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DegreeTemplate_isActive_idx" ON "DegreeTemplate"("isActive");

-- CreateIndex
CREATE INDEX "DegreeTemplateTask_degreeId_idx" ON "DegreeTemplateTask"("degreeId");

-- CreateIndex
CREATE INDEX "ScoutDegree_scoutId_idx" ON "ScoutDegree"("scoutId");

-- CreateIndex
CREATE INDEX "ScoutDegree_degreeId_idx" ON "ScoutDegree"("degreeId");

-- CreateIndex
CREATE UNIQUE INDEX "ScoutDegree_scoutId_degreeId_key" ON "ScoutDegree"("scoutId", "degreeId");

-- CreateIndex
CREATE INDEX "ScoutDegreeTask_scoutDegreeId_idx" ON "ScoutDegreeTask"("scoutDegreeId");

-- CreateIndex
CREATE INDEX "ScoutDegreeTask_templateTaskId_idx" ON "ScoutDegreeTask"("templateTaskId");

-- AddForeignKey
ALTER TABLE "DegreeTemplate" ADD CONSTRAINT "DegreeTemplate_troopId_fkey" FOREIGN KEY ("troopId") REFERENCES "ScoutTroop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DegreeTemplateTask" ADD CONSTRAINT "DegreeTemplateTask_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "DegreeTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutDegree" ADD CONSTRAINT "ScoutDegree_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "ScoutProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutDegree" ADD CONSTRAINT "ScoutDegree_degreeId_fkey" FOREIGN KEY ("degreeId") REFERENCES "DegreeTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutDegreeTask" ADD CONSTRAINT "ScoutDegreeTask_scoutDegreeId_fkey" FOREIGN KEY ("scoutDegreeId") REFERENCES "ScoutDegree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoutDegreeTask" ADD CONSTRAINT "ScoutDegreeTask_templateTaskId_fkey" FOREIGN KEY ("templateTaskId") REFERENCES "DegreeTemplateTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
