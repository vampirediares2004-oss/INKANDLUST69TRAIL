import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { VampireLogo } from '../VampireLogo';
import { useDarkMode } from '../../hooks/useDarkMode';
import toast from 'react-hot-toast';

export const LoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const { login, register, isLoading } = useAuthStore();
  const { isDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !passcode.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passcode.length < 6) {
      toast.error('Passcode must be at least 6 characters');
      return;
    }

    const success = isLogin 
      ? await login(username.trim(), passcode)
      : await register(username.trim(), passcode);

    if (success) {
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
    } else {
      toast.error(isLogin ? 'Invalid credentials' : 'Username already exists');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className={`backdrop-blur-md rounded-3xl shadow-2xl p-8 border transition-all duration-500 ${
          isDarkMode 
            ? 'bg-black/40 border-purple-500/30 shadow-purple-500/20' 
            : 'bg-white/90 border-white/20 shadow-black/20'
        }`}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 space-x-3">
              <VampireLogo className="w-12 h-12" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                INKANDLUST69
              </h1>
            </div>
            <p className={`mt-2 transition-colors duration-500 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Private & Secure Messaging</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-black/30 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-black/30 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your passcode"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-pink-600 hover:via-red-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-pink-400 hover:text-pink-300' 
                  : 'text-pink-600 hover:text-pink-700'
              }`}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};