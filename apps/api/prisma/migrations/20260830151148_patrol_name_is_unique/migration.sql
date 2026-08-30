/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ScoutPatrol` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ScoutPatrol_name_key" ON "ScoutPatrol"("name");
