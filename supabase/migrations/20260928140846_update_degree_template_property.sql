DROP POLICY IF EXISTS "DegreeTemplateTask_Troop_Leader_All"
ON public."DegreeTemplateTask";

-- ============================================================
-- DegreeTemplateTask
--
-- TYLKO DRUŻYNOWY
--
-- Dostęp do zadania jest kontrolowany przez drużynę,
-- do której należy jego DegreeTemplate.
-- ============================================================

CREATE POLICY "DegreeTemplateTask_Troop_Leader_All"
ON public."DegreeTemplateTask"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."DegreeTemplate" dt
    WHERE dt."id" = "templateId"
      AND public.is_troop_leader(dt."troopId")
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."DegreeTemplate" dt
    WHERE dt."id" = "templateId"
      AND public.is_troop_leader(dt."troopId")
  )
);