import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Image, Smile, MoreVertical } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';
import { MessageBubble } from './MessageBubble';
import { EmojiPicker } from './EmojiPicker';

interface ChatWindowProps {
  chatId: string;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, onBack }) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();
  
  const { currentChat, messages, fetchMessages, sendMessage } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }
  }, [chatId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !currentChat) return;

    try {
      await sendMessage(currentChat.id, messageText.trim());
      setMessageText('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`backdrop-blur-xl border-b p-4 flex items-center space-x-4 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/60 border-purple-500/40' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold">
            {currentChat.name?.charAt(0).toUpperCase() || 'C'}
          </span>
        </div>
        
        <div className="flex-1">
          <h2 className={`font-semibold transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {currentChat.name || 'Private Chat'}
          </h2>
          <p className={`text-sm transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentChat.is_group ? 'Group Chat' : 'Direct Message'}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MoreVertical className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 transition-colors duration-500 ${
        isDarkMode ? 'bg-black/20' : 'bg-gray-50/50'
      }`}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === user?.id}
              showAvatar={
                index === 0 || 
                messages[index - 1].sender_id !== message.sender_id
              }
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`backdrop-blur-xl border-t p-4 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/60 border-purple-500/40' 
          : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none max-h-32 transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-black/40 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-pink-400' 
                    : 'text-gray-500 hover:text-pink-600'
                }`}
              >
                <Smile className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1 transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-pink-400' 
                    : 'text-gray-500 hover:text-pink-600'
                }`}
              >
                <Image className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};