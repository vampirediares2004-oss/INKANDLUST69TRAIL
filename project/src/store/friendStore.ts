import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, FriendRequest, Friendship } from '../types';

interface FriendState {
  friends: User[];
  friendRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  blockedUsers: User[];
  isLoading: boolean;
  fetchFriends: (userId: string) => Promise<void>;
  fetchFriendRequests: (userId: string) => Promise<void>;
  sendFriendRequest: (username: string) => Promise<boolean>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  searchUsers: (username: string) => Promise<User[]>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  friendRequests: [],
  sentRequests: [],
  blockedUsers: [],
  isLoading: false,

  fetchFriends: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
          *,
          user1:users!friendships_user1_id_fkey(id, username, status, is_online, last_seen),
          user2:users!friendships_user2_id_fkey(id, username, status, is_online, last_seen)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

      if (error) throw error;

      const friends = friendships?.map(friendship => 
        friendship.user1_id === userId ? friendship.user2 : friendship.user1
      ).filter(Boolean) || [];

      set({ friends, isLoading: false });
    } catch (error) {
      console.error('Error fetching friends:', error);
      set({ isLoading: false });
    }
  },

  fetchFriendRequests: async (userId: string) => {
    try {
      const { data: received, error: receivedError } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:users!friend_requests_sender_id_fkey(id, username, status, is_online)
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending');

      const { data: sent, error: sentError } = await supabase
        .from('friend_requests')
        .select(`
          *,
          receiver:users!friend_requests_receiver_id_fkey(id, username, status, is_online)
        `)
        .eq('sender_id', userId)
        .eq('status', 'pending');

      if (receivedError || sentError) throw receivedError || sentError;

      set({
        friendRequests: received || [],
        sentRequests: sent || [],
      });
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  },

  sendFriendRequest: async (username: string) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      if (!currentUserId) return false;

      // Find user by username
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (userError || !users) return false;
      
      const targetUser = users;

      // Check if already friends or request exists
      
      const { data: existingRequest } = await supabase
        .from('friend_requests')
        .select('id')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${targetUser.id}),and(sender_id.eq.${targetUser.id},receiver_id.eq.${currentUserId})`)
        .maybeSingle();

      if (existingRequest) return false;

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: currentUserId,
          receiver_id: targetUser.id,
          status: 'pending',
        });

      return !error;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  },

  acceptFriendRequest: async (requestId: string) => {
    try {
      const { data: request, error: requestError } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .eq('id', requestId)
        .single();

      if (requestError || !request) throw requestError;

      // Create friendship
      const { error: friendshipError } = await supabase
        .from('friendships')
        .insert({
          user1_id: request.sender_id,
          user2_id: request.receiver_id,
        });

      if (friendshipError) throw friendshipError;

      // Update request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Refresh data
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      get().fetchFriends(currentUserId);
      get().fetchFriendRequests(currentUserId);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  },

  declineFriendRequest: async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      if (!error) {
        set(state => ({
          friendRequests: state.friendRequests.filter(req => req.id !== requestId)
        }));
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  },

  removeFriend: async (friendId: string) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      
      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${friendId}),and(user1_id.eq.${friendId},user2_id.eq.${currentUserId})`);

      if (!error) {
        set(state => ({
          friends: state.friends.filter(friend => friend.id !== friendId)
        }));
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  },

  blockUser: async (userId: string) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: currentUserId,
          blocked_id: userId,
        });

      if (!error) {
        // Remove from friends if they were friends
        get().removeFriend(userId);
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  },

  unblockUser: async (userId: string) => {
    try {
      const currentUserId = JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.user?.id;
      
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', currentUserId)
        .eq('blocked_id', userId);

      if (!error) {
        set(state => ({
          blockedUsers: state.blockedUsers.filter(user => user.id !== userId)
        }));
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  },

  searchUsers: async (username: string) => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, username, status, is_online, last_seen')
        .eq('username', username)
        .limit(10);

      if (error) throw error;
      return users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },
}));