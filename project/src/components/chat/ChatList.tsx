import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Image } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const { chats, isLoading, fetchChats } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchChats(user.id);
    }
  }, [user, fetchChats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Chats Yet</h3>
        <p className="text-gray-300">Start a conversation with your friends!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onChatSelect(chat.id)}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:bg-white/95 transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            {/* Chat Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                {chat.is_group ? (
                  <Users className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {chat.name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                )}
              </div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {chat.name || 'Private Chat'}
                </h3>
                {chat.last_message && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: true })}
                  </span>
                )}
              </div>
              
              {chat.last_message && (
                <div className="flex items-center space-x-1">
                  {chat.last_message.message_type === 'image' && (
                    <Image className="w-4 h-4 text-gray-500" />
                  )}
                  <p className="text-sm text-gray-600 truncate">
                    {chat.last_message.message_type === 'image' 
                      ? 'Photo' 
                      : chat.last_message.content
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};