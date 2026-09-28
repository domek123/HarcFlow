SET check_function_bodies = off;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- ============================================================
-- Czy aktualny użytkownik jest drużynowym danej drużyny?
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_troop_leader(
  p_troop_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    JOIN public."User" u
      ON u."id" = sp."userId"
    WHERE sp."troopId" = p_troop_id
      AND sp."isActive" = true
      AND sp."function" = 'DRUZYNOWY'::public."Function"
      AND u."authUserId" = auth.uid()
  );
$function$;


-- ============================================================
-- Czy aktualny użytkownik jest właścicielem ScoutProfile?
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_my_scout_profile(
  p_scout_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    JOIN public."User" u
      ON u."id" = sp."userId"
    WHERE sp."id" = p_scout_id
      AND sp."isActive" = true
      AND u."authUserId" = auth.uid()
  );
$function$;


-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public."DegreeTemplate"
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."DegreeTemplateTask"
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."ScoutDegree"
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."ScoutDegreeTask"
ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- DROP EXISTING POLICIES
-- ============================================================

DROP POLICY IF EXISTS "DegreeTemplate_Troop_Leader_All"
ON public."DegreeTemplate";

DROP POLICY IF EXISTS "DegreeTemplateTask_Troop_Leader_All"
ON public."DegreeTemplateTask";

DROP POLICY IF EXISTS "ScoutDegree_Troop_Leader_All"
ON public."ScoutDegree";

DROP POLICY IF EXISTS "ScoutDegree_Owner_Select"
ON public."ScoutDegree";

DROP POLICY IF EXISTS "ScoutDegreeTask_Troop_Leader_All"
ON public."ScoutDegreeTask";

DROP POLICY IF EXISTS "ScoutDegreeTask_Owner_Select"
ON public."ScoutDegreeTask";

DROP POLICY IF EXISTS "ScoutDegreeTask_Owner_Update"
ON public."ScoutDegreeTask";


-- ============================================================
-- DegreeTemplate
--
-- TYLKO DRUŻYNOWY
--
-- Harcerz nie ma nawet SELECT.
-- ============================================================

CREATE POLICY "DegreeTemplate_Troop_Leader_All"
ON public."DegreeTemplate"
FOR ALL
TO authenticated
USING (
  public.is_troop_leader("troopId")
)
WITH CHECK (
  public.is_troop_leader("troopId")
);

-- ============================================================
-- ScoutDegree
--
-- DRUŻYNOWY:
--   pełny CRUD prób swoich harcerzy
--
-- HARCERZ:
--   tylko SELECT własnej próby
-- ============================================================

CREATE POLICY "ScoutDegree_Troop_Leader_All"
ON public."ScoutDegree"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE sp."id" = "scoutId"
      AND public.is_troop_leader(sp."troopId")
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE sp."id" = "scoutId"
      AND public.is_troop_leader(sp."troopId")
  )
);


CREATE POLICY "ScoutDegree_Owner_Select"
ON public."ScoutDegree"
FOR SELECT
TO authenticated
USING (
  public.is_my_scout_profile("scoutId")
);


-- ============================================================
-- ScoutDegreeTask
--
-- DRUŻYNOWY:
--   pełny CRUD zadań
--
-- HARCERZ:
--   SELECT własnych zadań
--   UPDATE własnych zadań
-- ============================================================

CREATE POLICY "ScoutDegreeTask_Troop_Leader_All"
ON public."ScoutDegreeTask"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."ScoutDegree" sd
    JOIN public."ScoutProfile" sp
      ON sp."id" = sd."scoutId"
    WHERE sd."id" = "scoutDegreeId"
      AND public.is_troop_leader(sp."troopId")
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."ScoutDegree" sd
    JOIN public."ScoutProfile" sp
      ON sp."id" = sd."scoutId"
    WHERE sd."id" = "scoutDegreeId"
      AND public.is_troop_leader(sp."troopId")
  )
);


CREATE POLICY "ScoutDegreeTask_Owner_Select"
ON public."ScoutDegreeTask"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."ScoutDegree" sd
    WHERE sd."id" = "scoutDegreeId"
      AND public.is_my_scout_profile(sd."scoutId")
  )
);

-- ============================================================
-- GRANTS
--
-- RLS odpowiada za WIERSZE.
-- GRANT odpowiada za dostęp do tabeli.
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON public."DegreeTemplate"
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public."DegreeTemplateTask"
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public."ScoutDegree"
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public."ScoutDegreeTask"
TO authenticated;


-- ============================================================
-- FUNCTION EXECUTE
-- ============================================================

GRANT EXECUTE
ON FUNCTION public.is_troop_leader(uuid)
TO authenticated;

GRANT EXECUTE
ON FUNCTION public.is_my_scout_profile(uuid)
TO authenticated;