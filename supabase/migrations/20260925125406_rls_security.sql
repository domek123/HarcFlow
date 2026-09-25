SET local check_function_bodies = off;

-- =========================================================
-- RLS
-- =========================================================

ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Parent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScoutYear" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScoutProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserBadge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScoutNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScoutTroop" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScoutPatrol" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BadgeStore" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."InventoryItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Attendance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."_UserParents" ENABLE ROW LEVEL SECURITY;


-- =========================================================
-- HELPER FUNCTIONS
-- =========================================================

-- Returns application-level User.id for the currently authenticated
-- Supabase user.
CREATE OR REPLACE FUNCTION public.current_app_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT u."id"
  FROM public."User" u
  WHERE u."authUserId" = auth.uid()
  LIMIT 1;
$function$;


-- Checks whether the currently authenticated user is an admin.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."User" u
    WHERE u."authUserId" = auth.uid()
      AND u."role" = 'ADMIN'::public."Role"
  );
$function$;


-- Checks whether the current user belongs to a troop.
CREATE OR REPLACE FUNCTION public.is_member_of_troop(
  p_troop_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    JOIN public."User" u
      ON u."id" = sp."userId"
    WHERE sp."troopId" = p_troop_id
      AND sp."isActive" = true
      AND u."authUserId" = auth.uid()
  );
$function$;


-- Checks whether the current user is staff in a troop.
CREATE OR REPLACE FUNCTION public.is_staff_for_troop(
  target_troop_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    JOIN public."User" u
      ON u."id" = sp."userId"
    WHERE sp."troopId" = target_troop_id
      AND u."authUserId" = auth.uid()
      AND sp."function" IN ('DRUZYNOWY', 'PRZYBOCZNY')
  );
$function$;


-- Checks whether the target User belongs to the same troop
-- as the currently authenticated user.
--
-- SECURITY DEFINER is important here because this function
-- is used by the RLS policy on "User" itself.
CREATE OR REPLACE FUNCTION public.is_same_troop_user(
  p_user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" target_profile
    JOIN public."ScoutProfile" current_profile
      ON current_profile."troopId" = target_profile."troopId"
    JOIN public."User" current_user_record
      ON current_user_record."id" = current_profile."userId"
    WHERE target_profile."userId" = p_user_id
      AND current_profile."isActive" = true
      AND current_user_record."authUserId" = auth.uid()
  );
$function$;


-- Checks whether the current user is staff for a specific User.
CREATE OR REPLACE FUNCTION public.is_staff_for_user(
  p_user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" target_profile
    WHERE target_profile."userId" = p_user_id
      AND public.is_staff_for_troop(target_profile."troopId")
  );
$function$;


-- Checks whether the current user is staff for a ScoutProfile.
CREATE OR REPLACE FUNCTION public.is_staff_for_scout(
  target_profile_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    JOIN public."User" u
      ON u."id" = sp."userId"
    WHERE sp."id" = target_profile_id
      AND u."authUserId" = auth.uid()
      AND sp."function" IN ('DRUZYNOWY', 'PRZYBOCZNY')
  );
$function$;


-- Checks whether the current user is staff for a parent.
CREATE OR REPLACE FUNCTION public.is_staff_for_parent(
  p_parent_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public."_UserParents" up
    JOIN public."User" child_user
      ON child_user."id" = up."B"
    JOIN public."ScoutProfile" child_profile
      ON child_profile."userId" = child_user."id"
    WHERE up."A" = p_parent_id
      AND public.is_staff_for_troop(child_profile."troopId")
  );
$function$;


-- =========================================================
-- BUSINESS FUNCTIONS
-- =========================================================

-- Creates an application User when a Supabase Auth user is created.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public."User" (
    "authUserId",
    "email",
    "phoneNumber",
    "firstName",
    "lastName",
    "birthDate",
    "pesel",
    "gender",
    "role"
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'phoneNumber', ''),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'firstName', ''),
      'Użytkownik'
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'lastName', ''),
      ''
    ),
    NULLIF(
      NEW.raw_user_meta_data->>'birthDate',
      ''
    )::timestamp,
    NULLIF(
      NEW.raw_user_meta_data->>'pesel',
      ''
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'gender', ''),
      'MALE'
    )::public."Gender",
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'role', ''),
      'USER'
    )::public."Role"
  );

  RETURN NEW;
END;
$function$;


-- Adds a scout member to a troop.
CREATE OR REPLACE FUNCTION public.add_scout_member(
  p_first_name text,
  p_last_name text,
  p_email text DEFAULT NULL,
  p_phone_number text DEFAULT NULL,
  p_birth_date timestamp without time zone DEFAULT NULL,
  p_gender public."Gender" DEFAULT 'MALE'::public."Gender",
  p_troop_id uuid DEFAULT NULL,
  p_rank public."Rank" DEFAULT 'NONE'::public."Rank",
  p_degree public."Degree" DEFAULT 'NONE'::public."Degree",
  p_function public."Function" DEFAULT 'NONE'::public."Function"
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_member_id uuid;
BEGIN
  IF p_troop_id IS NULL THEN
    RAISE EXCEPTION 'Troop ID is required.';
  END IF;

  IF NOT public.is_staff_for_troop(p_troop_id) THEN
    RAISE EXCEPTION 'FORBIDDEN';
  END IF;

  INSERT INTO public."User" (
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "birthDate",
    "gender"
  )
  VALUES (
    p_first_name,
    p_last_name,
    p_email,
    p_phone_number,
    p_birth_date,
    p_gender
  )
  RETURNING "id"
  INTO v_member_id;

  INSERT INTO public."ScoutProfile" (
    "userId",
    "troopId",
    "rank",
    "degree",
    "function",
    "acquiringDegree",
    "hasNaramiennik",
    "joinedAt",
    "isActive"
  )
  VALUES (
    v_member_id,
    p_troop_id,
    p_rank,
    p_degree,
    p_function,
    'NONE',
    false,
    CURRENT_TIMESTAMP,
    true
  );

  RETURN v_member_id;
END;
$function$;


-- Changes badge stock.
CREATE OR REPLACE FUNCTION public.increment_badge_quantity(
  target_troop_id uuid,
  target_badge_id text,
  delta_val integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NOT public.is_staff_for_troop(target_troop_id) THEN
    RAISE EXCEPTION 'FORBIDDEN';
  END IF;

  INSERT INTO public."BadgeStore" (
    "troopId",
    "badgeId",
    "quantity",
    "updatedAt"
  )
  VALUES (
    target_troop_id,
    target_badge_id,
    GREATEST(0, delta_val),
    NOW()
  )
  ON CONFLICT ("troopId", "badgeId")
  DO UPDATE SET
    "quantity" = GREATEST(
      0,
      public."BadgeStore"."quantity" + delta_val
    ),
    "updatedAt" = NOW();
END;
$function$;


-- Changes inventory amount.
CREATE OR REPLACE FUNCTION public.increment_inventory_amount(
  target_item_id uuid,
  delta_val integer
)
RETURNS public."InventoryItem"
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_troop_id uuid;
  updated_item public."InventoryItem";
BEGIN
  SELECT "troopId"
  INTO v_troop_id
  FROM public."InventoryItem"
  WHERE "id" = target_item_id;

  IF v_troop_id IS NULL THEN
    RAISE EXCEPTION 'NOT_FOUND: Przedmiot nie istnieje.';
  END IF;

  IF NOT public.is_staff_for_troop(v_troop_id) THEN
    RAISE EXCEPTION 'FORBIDDEN';
  END IF;

  UPDATE public."InventoryItem"
  SET "amount" = "amount" + delta_val
  WHERE
    "id" = target_item_id
    AND ("amount" + delta_val) >= 0
  RETURNING *
  INTO updated_item;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'INVALID_AMOUNT: Stan magazynowy nie może być ujemny.';
  END IF;

  RETURN updated_item;
END;
$function$;


-- Updates a badge status and consumes one badge from inventory
-- when the badge becomes WON.
CREATE OR REPLACE FUNCTION public.update_badge_status(
  p_profile_id uuid,
  p_badge_id text,
  p_target_status public."BadgeStatus"
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_old_status public."BadgeStatus";
  v_troop_id uuid;
  v_updated boolean;
BEGIN
  SELECT
    ub."status",
    sp."troopId"
  INTO
    v_old_status,
    v_troop_id
  FROM public."UserBadge" ub
  JOIN public."ScoutProfile" sp
    ON sp."id" = ub."profileId"
  WHERE
    ub."profileId" = p_profile_id
    AND ub."badgeId" = p_badge_id;

  IF v_old_status IS NULL THEN
    RAISE EXCEPTION
      'NOT_FOUND: Harcerz nie posiada tej sprawności.';
  END IF;

  IF NOT public.is_staff_for_troop(v_troop_id) THEN
    RAISE EXCEPTION 'FORBIDDEN';
  END IF;

  IF v_old_status = 'WON'::public."BadgeStatus" THEN
    RAISE EXCEPTION
      'STATUS_LOCKED: Sprawność została już przyznana (WON) i nie można zmienić jej statusu.';
  END IF;

  IF v_old_status = p_target_status THEN
    RETURN;
  END IF;

  IF p_target_status = 'WON'::public."BadgeStatus" THEN

    UPDATE public."BadgeStore"
    SET
      "quantity" = "quantity" - 1,
      "updatedAt" = NOW()
    WHERE
      "troopId" = v_troop_id
      AND "badgeId" = p_badge_id
      AND "quantity" > 0
    RETURNING true
    INTO v_updated;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'INSUFFICIENT_STOCK: Brak sprawności w magazynie drużyny.';
    END IF;

  END IF;

  UPDATE public."UserBadge"
  SET "status" = p_target_status
  WHERE
    "profileId" = p_profile_id
    AND "badgeId" = p_badge_id;
END;
$function$;


-- =========================================================
-- AUTH TRIGGER
-- =========================================================

DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- =========================================================
-- REMOVE OLD POLICIES
-- =========================================================

DROP POLICY IF EXISTS "Zezwól na edycję magazynu tylko kadry drużyny"
ON public."BadgeStore";

DROP POLICY IF EXISTS "Zezwól na odczyt magazynu członkom drużyny"
ON public."BadgeStore";

DROP POLICY IF EXISTS "Druzynowy can insert events"
ON public."Event";

DROP POLICY IF EXISTS "Leaders can delete events"
ON public."Event";

DROP POLICY IF EXISTS "Leaders can update events"
ON public."Event";

DROP POLICY IF EXISTS "Members can view troop events"
ON public."Event";

DROP POLICY IF EXISTS "Leaders can insert events"
ON public."Event";

DROP POLICY IF EXISTS "Event_Members_Select"
ON public."Event";

DROP POLICY IF EXISTS "Event_Staff_Insert"
ON public."Event";

DROP POLICY IF EXISTS "Event_Staff_Update"
ON public."Event";

DROP POLICY IF EXISTS "Event_Staff_Delete"
ON public."Event";

DROP POLICY IF EXISTS "Członkowie drużyny mogą przeglądać magazyn"
ON public."InventoryItem";

DROP POLICY IF EXISTS "Drużynowy i Przyboczny mogą dodawać sprzęt"
ON public."InventoryItem";

DROP POLICY IF EXISTS "Drużynowy i Przyboczny mogą edytować sprzęt"
ON public."InventoryItem";

DROP POLICY IF EXISTS "Drużynowy i Przyboczny mogą usuwać sprzęt"
ON public."InventoryItem";

DROP POLICY IF EXISTS "Kadra może edytować rodziców ze swojej drużyny"
ON public."Parent";

DROP POLICY IF EXISTS "Kadra może tworzyć nowych rodziców"
ON public."Parent";

DROP POLICY IF EXISTS "Kadra może usuwać rodziców ze swojej drużyny"
ON public."Parent";

DROP POLICY IF EXISTS "Kadrze wolno odczytywać rodziców harcerzy ze swojej drużyny"
ON public."Parent";

DROP POLICY IF EXISTS "Kadra może dodawać notatki dla harcerzy ze swojej drużyny"
ON public."ScoutNote";

DROP POLICY IF EXISTS "Kadra może odczytywać notatki harcerzy ze swojej drużyny"
ON public."ScoutNote";

DROP POLICY IF EXISTS "Kadra może usuwać notatki harcerzy ze swojej drużyny"
ON public."ScoutNote";

DROP POLICY IF EXISTS "Zezwól na edycję patroli kadrze drużyny"
ON public."ScoutPatrol";

DROP POLICY IF EXISTS "Zezwól na odczyt patroli członkom drużyny"
ON public."ScoutPatrol";

DROP POLICY IF EXISTS "Zezwól na tworzenie patroli kadrze drużyny"
ON public."ScoutPatrol";

DROP POLICY IF EXISTS "Zezwól na usuwanie patroli kadrze drużyny"
ON public."ScoutPatrol";

DROP POLICY IF EXISTS "Zezwol na odczyt profilu harcerskiego"
ON public."ScoutProfile";

DROP POLICY IF EXISTS "ScoutProfile_Select" 
ON public."ScoutProfile";

DROP POLICY IF EXISTS "ScoutProfile_Staff_Insert"
ON public."ScoutProfile";

DROP POLICY IF EXISTS "ScoutProfile_Staff_Update"
ON public."ScoutProfile";

DROP POLICY IF EXISTS "ScoutProfile_Staff_Delete"
ON public."ScoutProfile";

DROP POLICY IF EXISTS "ScoutTroop_Admin"
ON public."ScoutTroop";

DROP POLICY IF EXISTS "ScoutTroop_Admin_Delete"
ON public."ScoutTroop";

DROP POLICY IF EXISTS "ScoutTroop_Admin_Insert"
ON public."ScoutTroop";

DROP POLICY IF EXISTS "ScoutTroop_Admin_Update"
ON public."ScoutTroop";

DROP POLICY IF EXISTS "ScoutTroop_Public_Select"
ON public."ScoutTroop";

DROP POLICY IF EXISTS "ScoutTroop_Members_Select"
ON public."ScoutTroop";

DROP POLICY IF EXISTS "User_SELECT_SELF"
ON public."User";

DROP POLICY IF EXISTS "User_Same_Troop_Select"
ON public."User";

DROP POLICY IF EXISTS "User_Staff_Update"
ON public."User";

DROP POLICY IF EXISTS "Członkowie drużyny widzą odznaki"
ON public."UserBadge";

DROP POLICY IF EXISTS "Drużynowy i Przyboczny mogą przydzielać sprawności"
ON public."UserBadge";

DROP POLICY IF EXISTS "Drużynowy i Przyboczny mogą zmieniać status sprawności"
ON public."UserBadge";

DROP POLICY IF EXISTS "UserBadge_Members_Select"
ON public."UserBadge";

DROP POLICY IF EXISTS "UserBadge_Staff_Insert"
ON public."UserBadge";

DROP POLICY IF EXISTS "UserBadge_Staff_Update"
ON public."UserBadge";

DROP POLICY IF EXISTS "Kadra może łączyć rodziców z harcerzami"
ON public."_UserParents";

DROP POLICY IF EXISTS "Kadra odczytuje relacje rodziców harcerzy ze swojej drużyny"
ON public."_UserParents";

DROP POLICY IF EXISTS "Kadra tworzy i usuwa powiązania rodzica z harcerzem ze swojej"
ON public."_UserParents";

DROP POLICY IF EXISTS "UserParents_Staff_Select"
ON public."_UserParents";

DROP POLICY IF EXISTS "UserParents_Staff_Insert"
ON public."_UserParents";

DROP POLICY IF EXISTS "UserParents_Staff_Delete"
ON public."_UserParents";


-- =========================================================
-- SCOUT YEAR
-- =========================================================

CREATE POLICY "ScoutYear_Authenticated_Select"
ON public."ScoutYear"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "ScoutYear_Admin_All"
ON public."ScoutYear"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- =========================================================
-- SCOUT TROOP
-- =========================================================

CREATE POLICY "ScoutTroop_Members_Select"
ON public."ScoutTroop"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_member_of_troop("id")
);

CREATE POLICY "ScoutTroop_Admin_All"
ON public."ScoutTroop"
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- =========================================================
-- USER
-- =========================================================

-- Users can always see themselves.
-- Other users are visible only inside the same troop.
CREATE POLICY "User_Same_Troop_Select"
ON public."User"
FOR SELECT
TO authenticated
USING (
  "authUserId" = auth.uid()
  OR public.is_same_troop_user("id")
  OR public.is_admin()
);


-- Only staff/admin can modify application user records.
CREATE POLICY "User_Staff_Update"
ON public."User"
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_user("id")
)
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_user("id")
);


-- =========================================================
-- SCOUT PROFILE
-- =========================================================

CREATE POLICY "ScoutProfile_Select"
ON public."ScoutProfile"
FOR SELECT
TO authenticated
USING (
  public.is_member_of_troop("troopId")
  OR public.is_admin()
);


CREATE POLICY "ScoutProfile_Staff_Insert"
ON public."ScoutProfile"
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_staff_for_troop("troopId")
  OR public.is_admin()
);


CREATE POLICY "ScoutProfile_Staff_Update"
ON public."ScoutProfile"
FOR UPDATE
TO authenticated
USING (
  public.is_staff_for_scout("id")
  OR public.is_admin()
)
WITH CHECK (
  public.is_staff_for_troop("troopId")
  OR public.is_admin()
);


CREATE POLICY "ScoutProfile_Staff_Delete"
ON public."ScoutProfile"
FOR DELETE
TO authenticated
USING (
  public.is_staff_for_scout("id")
  OR public.is_admin()
);


-- =========================================================
-- EVENTS
-- =========================================================

CREATE POLICY "Event_Members_Select"
ON public."Event"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_member_of_troop("troopId")
);


CREATE POLICY "Event_Staff_Insert"
ON public."Event"
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


CREATE POLICY "Event_Staff_Update"
ON public."Event"
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
)
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


CREATE POLICY "Event_Staff_Delete"
ON public."Event"
FOR DELETE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


-- =========================================================
-- ATTENDANCE
-- =========================================================

CREATE POLICY "Attendance_Members_Select"
ON public."Attendance"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."Event" e
    WHERE e."id" = "Attendance"."eventId"
      AND (
        public.is_admin()
        OR public.is_member_of_troop(e."troopId")
      )
  )
);


CREATE POLICY "Attendance_Staff_Insert"
ON public."Attendance"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."Event" e
    JOIN public."ScoutProfile" sp
      ON sp."id" = "Attendance"."scoutId"
    WHERE e."id" = "Attendance"."eventId"
      AND e."troopId" = sp."troopId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(e."troopId")
      )
  )
);


CREATE POLICY "Attendance_Staff_Update"
ON public."Attendance"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."Event" e
    WHERE e."id" = "Attendance"."eventId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(e."troopId")
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."Event" e
    JOIN public."ScoutProfile" sp
      ON sp."id" = "Attendance"."scoutId"
    WHERE e."id" = "Attendance"."eventId"
      AND e."troopId" = sp."troopId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(e."troopId")
      )
  )
);


CREATE POLICY "Attendance_Staff_Delete"
ON public."Attendance"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."Event" e
    WHERE e."id" = "Attendance"."eventId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(e."troopId")
      )
  )
);


-- =========================================================
-- BADGE STORE
-- =========================================================

CREATE POLICY "BadgeStore_Members_Select"
ON public."BadgeStore"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_member_of_troop("troopId")
);


CREATE POLICY "BadgeStore_Staff_All"
ON public."BadgeStore"
FOR ALL
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
)
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


-- =========================================================
-- INVENTORY
-- =========================================================

CREATE POLICY "Inventory_Members_Select"
ON public."InventoryItem"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_member_of_troop("troopId")
);


CREATE POLICY "Inventory_Staff_All"
ON public."InventoryItem"
FOR ALL
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
)
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


-- =========================================================
-- USER BADGES
-- =========================================================

CREATE POLICY "UserBadge_Members_Select"
ON public."UserBadge"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE sp."id" = "UserBadge"."profileId"
      AND (
        public.is_admin()
        OR public.is_member_of_troop(sp."troopId")
      )
  )
);


CREATE POLICY "UserBadge_Staff_Insert"
ON public."UserBadge"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE sp."id" = "UserBadge"."profileId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(sp."troopId")
      )
  )
);


CREATE POLICY "UserBadge_Staff_Update"
ON public."UserBadge"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE sp."id" = "UserBadge"."profileId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(sp."troopId")
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE sp."id" = "UserBadge"."profileId"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(sp."troopId")
      )
  )
);


-- =========================================================
-- NOTES
-- =========================================================

CREATE POLICY "ScoutNote_Staff_Insert"
ON public."ScoutNote"
FOR INSERT
TO authenticated
WITH CHECK (
  (
    public.is_admin()
    OR public.is_staff_for_scout("profileId")
  )
  AND "authorId" = public.current_app_user_id()
);


CREATE POLICY "ScoutNote_Staff_Select"
ON public."ScoutNote"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_scout("profileId")
);


CREATE POLICY "ScoutNote_Staff_Delete"
ON public."ScoutNote"
FOR DELETE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_scout("profileId")
);


-- =========================================================
-- PATROLS
-- =========================================================

CREATE POLICY "ScoutPatrol_Members_Select"
ON public."ScoutPatrol"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_member_of_troop("troopId")
);


CREATE POLICY "ScoutPatrol_Staff_Insert"
ON public."ScoutPatrol"
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


CREATE POLICY "ScoutPatrol_Staff_Update"
ON public."ScoutPatrol"
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
)
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


CREATE POLICY "ScoutPatrol_Staff_Delete"
ON public."ScoutPatrol"
FOR DELETE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_troop("troopId")
);


-- =========================================================
-- PARENTS
-- =========================================================

CREATE POLICY "Parent_Staff_Select"
ON public."Parent"
FOR SELECT
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_parent("id")
);


-- Parent itself does not contain troopId.
-- Creation is therefore limited to authenticated staff/admin.
CREATE POLICY "Parent_Staff_Insert"
ON public."Parent"
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  OR EXISTS (
    SELECT 1
    FROM public."ScoutProfile" sp
    WHERE public.is_staff_for_troop(sp."troopId")
  )
);


CREATE POLICY "Parent_Staff_Update"
ON public."Parent"
FOR UPDATE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_parent("id")
)
WITH CHECK (
  public.is_admin()
  OR public.is_staff_for_parent("id")
);


CREATE POLICY "Parent_Staff_Delete"
ON public."Parent"
FOR DELETE
TO authenticated
USING (
  public.is_admin()
  OR public.is_staff_for_parent("id")
);


-- =========================================================
-- USER ↔ PARENT
-- =========================================================

CREATE POLICY "UserParents_Staff_Select"
ON public."_UserParents"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."User" child_user
    JOIN public."ScoutProfile" child_profile
      ON child_profile."userId" = child_user."id"
    WHERE child_user."id" = "_UserParents"."B"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(child_profile."troopId")
      )
  )
);


CREATE POLICY "UserParents_Staff_Insert"
ON public."_UserParents"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public."User" child_user
    JOIN public."ScoutProfile" child_profile
      ON child_profile."userId" = child_user."id"
    WHERE child_user."id" = "_UserParents"."B"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(child_profile."troopId")
      )
  )
);


CREATE POLICY "UserParents_Staff_Delete"
ON public."_UserParents"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."User" child_user
    JOIN public."ScoutProfile" child_profile
      ON child_profile."userId" = child_user."id"
    WHERE child_user."id" = "_UserParents"."B"
      AND (
        public.is_admin()
        OR public.is_staff_for_troop(child_profile."troopId")
      )
  )
);


-- =========================================================
-- BADGE TO BUY VIEW
-- =========================================================

CREATE OR REPLACE VIEW public."BadgeToBuyView"
WITH (security_invoker = true)
AS
WITH neededbadges AS (
  SELECT
    sp."troopId",
    ub."badgeId",
    count(*)::integer AS "neededCount"
  FROM public."UserBadge" ub
  JOIN public."ScoutProfile" sp
    ON sp."id" = ub."profileId"
  WHERE ub."status" IN (
    'PLANNED'::public."BadgeStatus",
    'COMPLETED'::public."BadgeStatus"
  )
  GROUP BY
    sp."troopId",
    ub."badgeId"
)
SELECT
  n."troopId" || '_' || n."badgeId" AS id,
  n."troopId",
  n."badgeId",
  n."neededCount",
  COALESCE(bs."quantity", 0) AS "inStock",
  GREATEST(
    0,
    n."neededCount" - COALESCE(bs."quantity", 0)
  ) AS "toBuyCount"
FROM neededbadges n
LEFT JOIN public."BadgeStore" bs
  ON bs."troopId" = n."troopId"
  AND bs."badgeId" = n."badgeId"
WHERE
  n."neededCount" - COALESCE(bs."quantity", 0) > 0;


-- =========================================================
-- GRANTS
-- =========================================================

GRANT USAGE
ON SCHEMA public
TO authenticated;


GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.current_app_user_id()
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_admin()
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_member_of_troop(uuid)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_staff_for_troop(uuid)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_same_troop_user(uuid)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_staff_for_user(uuid)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_staff_for_scout(uuid)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.is_staff_for_parent(uuid)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.add_scout_member(
  text,
  text,
  text,
  text,
  timestamp without time zone,
  public."Gender",
  uuid,
  public."Rank",
  public."Degree",
  public."Function"
)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.increment_badge_quantity(
  uuid,
  text,
  integer
)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.increment_inventory_amount(
  uuid,
  integer
)
TO authenticated;


GRANT EXECUTE
ON FUNCTION public.update_badge_status(
  uuid,
  text,
  public."BadgeStatus"
)
TO authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO authenticated;

GRANT EXECUTE
ON ALL FUNCTIONS IN SCHEMA public
TO authenticated;