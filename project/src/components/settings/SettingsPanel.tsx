import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  Shield, 
  Download,
  Smartphone,
  Edit3
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';
import toast from 'react-hot-toast';

export const SettingsPanel: React.FC = () => {
  const [showStatusEdit, setShowStatusEdit] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { user, logout, updateStatus } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleStatusUpdate = async () => {
    if (newStatus.trim()) {
      await updateStatus(newStatus.trim());
      setShowStatusEdit(false);
      setNewStatus('');
      toast.success('Status updated');
    }
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Username',
          value: user?.username,
          action: () => {},
        },
        {
          icon: Edit3,
          label: 'Status',
          value: user?.status || 'Set a status...',
          action: () => setShowStatusEdit(true),
        },
        {
          icon: Lock,
          label: 'Change Passcode',
          action: () => {},
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Shield,
          label: 'Blocked Users',
          action: () => {},
        },
        {
          icon: Smartphone,
          label: 'Active Sessions',
          action: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: isDarkMode ? Sun : Moon,
          label: 'Dark Mode',
          toggle: true,
          value: isDarkMode,
          action: toggleDarkMode,
        },
        {
          icon: Bell,
          label: 'Notifications',
          action: () => {},
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          action: () => {},
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-md rounded-3xl p-6 text-center transition-all duration-500 ${
          isDarkMode 
            ? 'bg-black/40 border border-purple-500/30' 
            : 'bg-white/90 border border-white/20'
        }`}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">
            {user?.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className={`text-xl font-bold transition-colors duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>{user?.username}</h2>
        {user?.status && (
          <p className={`mt-1 transition-colors duration-500 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{user.status}</p>
        )}
      </motion.div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className={`backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-500 ${
            isDarkMode 
              ? 'bg-black/40 border border-purple-500/30' 
              : 'bg-white/90 border border-white/20'
          }`}
        >
          <h3 className={`text-lg font-semibold p-4 border-b transition-colors duration-500 ${
            isDarkMode 
              ? 'text-white border-gray-700' 
              : 'text-gray-900 border-gray-100'
          }`}>
            {group.title}
          </h3>
          <div className={`divide-y transition-colors duration-500 ${
            isDarkMode ? 'divide-gray-700' : 'divide-gray-100'
          }`}>
            {group.items.map((item, itemIndex) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={itemIndex}
                  whileHover={{ 
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' 
                  }}
                  onClick={item.action}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors duration-200 ${
                    isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`} />
                    <span className={`font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{item.label}</span>
                  </div>
                  {item.value && (
                    <span className={`text-sm truncate max-w-32 transition-colors duration-500 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {item.value}
                    </span>
                  )}
                  {item.toggle && (
                    <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      item.value 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
                        : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        item.value ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-3xl font-semibold flex items-center justify-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </motion.button>

      {/* Status Edit Modal */}
      {showStatusEdit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowStatusEdit(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl p-6 w-full max-w-sm backdrop-blur-md transition-all duration-500 ${
              isDarkMode 
                ? 'bg-black/80 border border-purple-500/30' 
                : 'bg-white/95 border border-white/20'
            }`}
          >
            <h3 className={`text-lg font-bold mb-4 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Update Status</h3>
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="What's on your mind?"
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4 transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-black/30 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              maxLength={50}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusEdit(false)}
                className={`flex-1 py-3 border rounded-xl transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-gray-300 border-gray-600 hover:bg-gray-700' 
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                Update
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};