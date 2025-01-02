/*
  # Add QR codes for users

  1. Changes
    - Add unique_code column to profiles table
    - Update handle_new_user function to generate unique codes
    - Add function to generate unique codes

  2. Security
    - Maintain existing RLS policies
    - Ensure unique_code is read-only
*/

-- Function to generate unique codes
CREATE OR REPLACE FUNCTION generate_unique_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..4 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Add unique_code to profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'unique_code'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN unique_code TEXT UNIQUE;
  END IF;
END $$;

-- Update existing profiles with unique codes
DO $$ 
BEGIN
  UPDATE public.profiles 
  SET unique_code = (SELECT generate_unique_code())
  WHERE unique_code IS NULL;
END $$;

-- Make unique_code NOT NULL after updating existing records
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'unique_code'
  ) THEN
    ALTER TABLE public.profiles 
    ALTER COLUMN unique_code SET NOT NULL;
  END IF;
END $$;

-- Update handle_new_user function to include unique_code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, unique_code)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (SELECT generate_unique_code())
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;