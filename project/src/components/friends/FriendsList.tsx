import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MoreVertical, Circle, Users } from 'lucide-react';
import { useFriendStore } from '../../store/friendStore';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export const FriendsList: React.FC = () => {
  const { friends, isLoading, fetchFriends } = useFriendStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchFriends(user.id);
    }
  }, [user, fetchFriends]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Friends Yet</h3>
        <p className="text-gray-500">Send friend requests to start chatting!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((friend, index) => (
        <motion.div
          key={friend.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-4 hover:bg-white/95 transition-all duration-200"
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {friend.username.charAt(0).toUpperCase()}
              </span>
            </div>
            {friend.is_online && (
              <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{friend.username}</h3>
            {friend.status && (
              <p className="text-sm text-gray-600 truncate">{friend.status}</p>
            )}
            {!friend.is_online && (
              <p className="text-xs text-gray-500">
                Last seen {formatDistanceToNow(new Date(friend.last_seen), { addSuffix: true })}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-pink-600 hover:bg-pink-50 rounded-full transition-colors duration-200"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors duration-200"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};