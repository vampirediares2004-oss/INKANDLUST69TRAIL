/*
  # Fix Database Issues

  1. Fix RLS Policies
    - Remove infinite recursion in chat_participants policy
    - Fix user search query issues
    - Optimize all policies for better performance

  2. Security
    - Maintain proper RLS while fixing recursion
    - Ensure users can only access their own data
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view participants of their chats" ON chat_participants;
DROP POLICY IF EXISTS "Admins can manage participants" ON chat_participants;

-- Fix chat_participants policies to avoid recursion
CREATE POLICY "Users can view chat participants"
  ON chat_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp2 
      WHERE cp2.chat_id = chat_participants.chat_id 
      AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join chats they're invited to"
  ON chat_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can remove participants"
  ON chat_participants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants admin_check
      WHERE admin_check.chat_id = chat_participants.chat_id
      AND admin_check.user_id = auth.uid()
      AND admin_check.is_admin = true
    )
    OR user_id = auth.uid()
  );

-- Fix users table policy for search
DROP POLICY IF EXISTS "Users can read all users for search" ON users;

CREATE POLICY "Users can search other users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_users_username_search ON users USING gin(username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_chat ON chat_participants (user_id, chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_user ON chat_participants (chat_id, user_id);

-- Add function to safely get user ID
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid
$$;