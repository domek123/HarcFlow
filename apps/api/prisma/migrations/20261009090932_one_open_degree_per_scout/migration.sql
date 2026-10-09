CREATE UNIQUE INDEX "ScoutDegree_one_in_progress_per_scout"
ON "ScoutDegree" ("scoutId")
WHERE status = 'IN_PROGRESS';