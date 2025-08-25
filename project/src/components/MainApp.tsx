import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Moon, Sun } from 'lucide-react';
import { Layout } from './Layout';
import { BottomNav } from './navigation/BottomNav';
import { FriendsList } from './friends/FriendsList';
import { AddFriend } from './friends/AddFriend';
import { RequestsList } from './requests/RequestsList';
import { ChatList } from './chat/ChatList';
import { ChatWindow } from './chat/ChatWindow';
import { SettingsPanel } from './settings/SettingsPanel';
import { VampireLogo } from './VampireLogo';
import { useDarkMode } from '../hooks/useDarkMode';

export const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const renderContent = () => {
    if (selectedChatId) {
      return (
        <ChatWindow
          chatId={selectedChatId}
          onBack={() => setSelectedChatId(null)}
        />
      );
    }

    switch (activeTab) {
      case 'friends':
        return <FriendsList />;
      case 'chats':
        return <ChatList onChatSelect={setSelectedChatId} />;
      case 'requests':
        return <RequestsList />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ChatList onChatSelect={setSelectedChatId} />;
    }
  };

  const getTitle = () => {
    if (selectedChatId) return '';
    
    switch (activeTab) {
      case 'friends':
        return 'Friends';
      case 'chats':
        return 'Chats';
      case 'requests':
        return 'Requests';
      case 'settings':
        return 'Settings';
      default:
        return 'INKANDLUST69';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        {!selectedChatId && (
          <div className={`backdrop-blur-md border-b p-4 flex items-center justify-between transition-all duration-500 ${
            isDarkMode 
              ? 'bg-black/40 border-purple-500/30' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <VampireLogo className="w-8 h-8" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                {getTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-yellow-400/20' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
            {activeTab === 'friends' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddFriend(true)}
                className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-4 pb-20 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + (selectedChatId || '')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation */}
        {!selectedChatId && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Add Friend Modal */}
        <AddFriend
          isOpen={showAddFriend}
          onClose={() => setShowAddFriend(false)}
        />
      </div>
    </Layout>
  );
};