export interface User {
  id: string;
  username: string;
  status?: string;
  is_online: boolean;
  last_seen: string;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface Friendship {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  user1?: User;
  user2?: User;
}

export interface Chat {
  id: string;
  name?: string;
  is_group: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_message?: Message;
  participants?: ChatParticipant[];
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  user?: User;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content?: string;
  image_url?: string;
  message_type: 'text' | 'image';
  created_at: string;
  edited_at?: string;
  sender?: User;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: User;
}

export interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_user?: User;
}