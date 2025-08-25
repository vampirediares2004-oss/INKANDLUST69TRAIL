import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Chat, Message, ChatParticipant } from '../types';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  fetchChats: (userId: string) => Promise<void>;
  createChat: (participantIds: string[], isGroup: boolean, name?: string) => Promise<string | null>;
  setCurrentChat: (chat: Chat | null) => void;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, messageType: 'text' | 'image') => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,

  fetchChats: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Get chat IDs where user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from('chat_participants')
        .select('chat_id')
        .eq('user_id', userId);

      if (participantError) throw participantError;

      if (!participantData || participantData.length === 0) {
        set({ chats: [], isLoading: false });
        return;
      }

      const chatIds = participantData.map(p => p.chat_id);

      const { data: chats, error: chatDetailsError } = await supabase
        .from('chats')
        .select('id, name, is_group, created_by, created_at, updated_at')
        .in('id', chatIds)
        .order('updated_at', { ascending: false });

      if (chatDetailsError) throw chatDetailsError;

      set({ chats, isLoading: false });
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ isLoading: false });
    }
  },

  createChat: async (participantIds: string[], isGroup: boolean, name?: string) => {
    try {
      const { data: chat, error } = await supabase
        .from('chats')
        .insert({
          name: isGroup ? name : null,
          is_group: isGroup,
          created_by: participantIds[0],
        })
        .select()
        .single();

      if (error) throw error;

      // Add participants
      const participants = participantIds.map((userId, index) => ({
        chat_id: chat.id,
        user_id: userId,
        is_admin: index === 0, // First user is admin
      }));

      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert(participants);

      if (participantError) throw participantError;

      return chat.id;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  },

  setCurrentChat: (chat: Chat | null) => {
    set({ currentChat: chat, messages: [] });
  },

  fetchMessages: async (chatId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, username),
          reactions:message_reactions(
            id,
            emoji,
            user:users(id, username)
          )
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ messages: messages || [] });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  sendMessage: async (chatId: string, content: string, messageType: 'text' | 'image') => {
    try {
      const { user } = get().currentChat ? { user: null } : { user: null };
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      
      if (!currentUserId) return;

      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: currentUserId,
          content: messageType === 'text' ? content : null,
          image_url: messageType === 'image' ? content : null,
          message_type: messageType,
        })
        .select(`
          *,
          sender:users(id, username)
        `)
        .single();

      if (error) throw error;

      set(state => ({
        messages: [...state.messages, message]
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  addReaction: async (messageId: string, emoji: string) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: currentUserId,
          emoji,
        });

      if (!error) {
        // Refresh messages to get updated reactions
        const currentChat = get().currentChat;
        if (currentChat) {
          get().fetchMessages(currentChat.id);
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  },

  removeReaction: async (messageId: string, emoji: string) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', currentUserId)
        .eq('emoji', emoji);

      if (!error) {
        const currentChat = get().currentChat;
        if (currentChat) {
          get().fetchMessages(currentChat.id);
        }
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  },
}));