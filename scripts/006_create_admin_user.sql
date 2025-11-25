-- ============================================
-- CREATE ADMIN USER WITH SPECIFIED CREDENTIALS
-- Email: ankitkumar02say@gmail.com
-- Password: 123456
-- ============================================

-- Note: This user will need to sign up through Supabase Auth
-- After signup, run this script to set the user as admin

-- First, we'll create a function to set user as admin after they sign up
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user_roles table to set the user as admin
  UPDATE public.user_roles
  SET role = 'admin'
  WHERE user_id = (SELECT id FROM auth.users WHERE email = user_email);
  
  -- If no role exists, insert one
  IF NOT FOUND THEN
    INSERT INTO public.user_roles (user_id, role)
    SELECT id, 'admin'
    FROM auth.users
    WHERE email = user_email;
  END IF;
END;
$$;

-- Instructions for setting up admin:
-- 1. Go to /auth/sign-up and create an account with email: ankitkumar02say@gmail.com and password: 123456
-- 2. After signup, the trigger will automatically create a user_roles entry
-- 3. Run the following command in Supabase SQL editor to make this user an admin:
--    SELECT public.set_user_as_admin('ankitkumar02say@gmail.com');

-- Alternatively, if the user already exists in auth.users, run this directly:
DO $$
BEGIN
  -- Check if user exists and update role
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'ankitkumar02say@gmail.com') THEN
    UPDATE public.user_roles
    SET role = 'admin'
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ankitkumar02say@gmail.com');
    
    IF NOT FOUND THEN
      INSERT INTO public.user_roles (user_id, role)
      SELECT id, 'admin'
      FROM auth.users
      WHERE email = 'ankitkumar02say@gmail.com';
    END IF;
    
    RAISE NOTICE 'Admin user setup complete for ankitkumar02say@gmail.com';
  ELSE
    RAISE NOTICE 'User not found. Please sign up first at /auth/sign-up with email: ankitkumar02say@gmail.com and password: 123456';
  END IF;
END $$;
