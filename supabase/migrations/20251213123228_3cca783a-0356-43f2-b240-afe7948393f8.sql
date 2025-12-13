-- Update the admin signup trigger to use the new email
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Auto-assign admin role for the approved admin email
  IF NEW.email = 'theatlanticcreators@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;