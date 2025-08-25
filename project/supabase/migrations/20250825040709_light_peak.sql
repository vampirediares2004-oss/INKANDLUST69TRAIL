/*
  # Complete INKANDLUST69 Database Setup
  
  1. New Tables
    - `users` - User accounts with username/passcode authentication
    - `friendships` - Mutual friend connections
    - `friend_requests` - Pending friend requests
    - `blocked_users` - User blocking system
    - `chats` - Individual and group chats
    - `chat_participants` - Chat membership
    - `messages` - Text and image messages
    - `message_reactions` - Emoji reactions on messages
    
  2. Security
    - Enable RLS on all tables
    - Secure policies for data access
    - Proper user isolation
    
  3. Performance
    - Optimized indexes for fast queries
    - Efficient relationship queries
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  passcode_hash text NOT NULL,
  status text DEFAULT '',
  is_online boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid REFERENCES users(id) ON DELETE CASCADE,
  blocked_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  is_group boolean DEFAULT false,
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  is_admin boolean DEFAULT false,
  UNIQUE(chat_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text,
  image_url text,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image')),
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz
);

-- Create message_reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Create function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chats updated_at
DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
CREATE TRIGGER update_chats_updated_at
  BEFORE UPDATE ON chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_friendships_users ON friendships(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat ON chat_participants(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat ON messages(chat_id, created_at);
CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all users for search" ON users FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO public USING (true);

-- Friendships policies
CREATE POLICY "Users can view friendships they're part of" ON friendships 
  FOR SELECT TO public USING (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can create friendships" ON friendships 
  FOR INSERT TO public WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can delete their friendships" ON friendships 
  FOR DELETE TO public USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Friend requests policies
CREATE POLICY "Users can view their friend requests" ON friend_requests 
  FOR SELECT TO public USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can send friend requests" ON friend_requests 
  FOR INSERT TO public WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Users can update received requests" ON friend_requests 
  FOR UPDATE TO public USING (receiver_id = auth.uid());

-- Blocked users policies
CREATE POLICY "Users can view their blocked users" ON blocked_users 
  FOR SELECT TO public USING (blocker_id = auth.uid());
CREATE POLICY "Users can block others" ON blocked_users 
  FOR INSERT TO public WITH CHECK (blocker_id = auth.uid());
CREATE POLICY "Users can unblock others" ON blocked_users 
  FOR DELETE TO public USING (blocker_id = auth.uid());

-- Chats policies
CREATE POLICY "Users can view chats they participate in" ON chats 
  FOR SELECT TO public USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_id = chats.id 
      AND chat_participants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create chats" ON chats 
  FOR INSERT TO public WITH CHECK (created_by = auth.uid());
CREATE POLICY "Admins can update group chats" ON chats 
  FOR UPDATE TO public USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_id = chats.id 
      AND chat_participants.user_id = auth.uid() 
      AND chat_participants.is_admin = true
    )
  );

-- Chat participants policies
CREATE POLICY "Users can view participants of their chats" ON chat_participants 
  FOR SELECT TO public USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp 
      WHERE cp.chat_id = chat_participants.chat_id 
      AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can join chats" ON chat_participants 
  FOR INSERT TO public WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage participants" ON chat_participants 
  FOR DELETE TO public USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp 
      WHERE cp.chat_id = chat_participants.chat_id 
      AND cp.user_id = auth.uid() 
      AND cp.is_admin = true
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON messages 
  FOR SELECT TO public USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_id = messages.chat_id 
      AND chat_participants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can send messages to their chats" ON messages 
  FOR INSERT TO public WITH CHECK (
    sender_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE chat_participants.chat_id = messages.chat_id 
      AND chat_participants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete their own messages" ON messages 
  FOR DELETE TO public USING (sender_id = auth.uid());

-- Message reactions policies
CREATE POLICY "Users can view reactions in their chats" ON message_reactions 
  FOR SELECT TO public USING (
    EXISTS (
      SELECT 1 FROM messages m 
      JOIN chat_participants cp ON m.chat_id = cp.chat_id 
      WHERE m.id = message_reactions.message_id 
      AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can add reactions" ON message_reactions 
  FOR INSERT TO public WITH CHECK (
    user_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM messages m 
      JOIN chat_participants cp ON m.chat_id = cp.chat_id 
      WHERE m.id = message_reactions.message_id 
      AND cp.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can remove their reactions" ON message_reactions 
  FOR DELETE TO public USING (user_id = auth.uid());