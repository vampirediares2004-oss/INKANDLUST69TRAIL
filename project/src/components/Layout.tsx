import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

interface LayoutProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showBackground = true }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {showBackground && (
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{
              backgroundImage: 'url(/IMG-20250818-WA0009.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          <div className={`absolute inset-0 transition-all duration-500 ${
            isDarkMode 
              ? 'bg-black/60 backdrop-blur-[1px]' 
              : 'bg-black/30 backdrop-blur-[0.5px]'
          }`} />
        </div>
      )}
      <motion.div 
        className={`relative z-10 min-h-screen transition-colors duration-500 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};