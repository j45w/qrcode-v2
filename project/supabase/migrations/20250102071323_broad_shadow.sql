/*
  # Guest Management System Schema

  1. New Tables
    - `guests`
      - `id` (uuid, primary key)
      - `unique_code` (text, unique identifier for QR)
      - `full_name` (text)
      - `email` (text)
      - `scanned` (boolean)
      - `scanned_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Policies for authenticated users to manage guests
*/

CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unique_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  scanned BOOLEAN DEFAULT false,
  scanned_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view guests they created"
  ON public.guests
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create guests"
  ON public.guests
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update guests they created"
  ON public.guests
  FOR UPDATE
  USING (auth.uid() = created_by);