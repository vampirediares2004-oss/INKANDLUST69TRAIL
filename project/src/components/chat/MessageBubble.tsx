import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Smile, MoreHorizontal } from 'lucide-react';
import { Message } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  showAvatar 
}) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleLongPress = () => {
    setShowReactions(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {message.sender?.username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Message */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onTouchStart={handleLongPress}
          className={`relative group ${showAvatar ? '' : isOwn ? 'mr-10' : 'ml-10'}`}
        >
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white text-gray-900'
            } shadow-sm`}
          >
            {message.message_type === 'text' ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <img
                src={message.image_url}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>

          {/* Timestamp */}
          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </p>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <motion.span
                  key={reaction.id}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center space-x-1 shadow-sm"
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-gray-600">1</span>
                </motion.span>
              ))}
            </div>
          )}

          {/* Quick Reaction Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-8' : 'right-0 translate-x-8'} p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200`}
            onClick={() => setShowReactions(!showReactions)}
          >
            <Heart className="w-4 h-4 text-pink-500" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};