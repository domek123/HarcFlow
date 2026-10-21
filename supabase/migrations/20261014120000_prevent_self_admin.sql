-- New Supabase users are always regular application users.
-- Administrator promotion must happen through a trusted server-side operation.
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
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'firstName', ''), 'Użytkownik'),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'lastName', ''), ''),
    NULLIF(NEW.raw_user_meta_data->>'birthDate', '')::timestamp,
    NULLIF(NEW.raw_user_meta_data->>'pesel', ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'gender', ''), 'MALE')::public."Gender",
    'USER'::public."Role"
  );

  RETURN NEW;
END;
$function$;