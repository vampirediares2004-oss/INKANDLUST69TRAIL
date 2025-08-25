import React from 'react';
import { motion } from 'framer-motion';

export const VampireLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Vampire head silhouette */}
      <path
        d="M50 10C35 10 25 20 25 35C25 45 30 50 35 55L40 65C42 70 45 75 50 75C55 75 58 70 60 65L65 55C70 50 75 45 75 35C75 20 65 10 50 10Z"
        fill="url(#vampireGradient)"
      />
      
      {/* Vampire fangs */}
      <path
        d="M42 45L45 55L48 45Z"
        fill="#ffffff"
      />
      <path
        d="M52 45L55 55L58 45Z"
        fill="#ffffff"
      />
      
      {/* Eyes (glowing red) */}
      <circle cx="42" cy="35" r="3" fill="#ff0000" opacity="0.8" />
      <circle cx="58" cy="35" r="3" fill="#ff0000" opacity="0.8" />
      
      {/* Cape/collar */}
      <path
        d="M25 35C25 30 30 25 35 25L65 25C70 25 75 30 75 35L75 40C70 38 60 36 50 36C40 36 30 38 25 40Z"
        fill="url(#capeGradient)"
      />
      
      {/* Bat wings */}
      <path
        d="M20 40C15 35 10 40 15 45C20 50 25 45 25 40"
        fill="url(#wingGradient)"
      />
      <path
        d="M80 40C85 35 90 40 85 45C80 50 75 45 75 40"
        fill="url(#wingGradient)"
      />
      
      <defs>
        <linearGradient id="vampireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B0000" />
          <stop offset="50%" stopColor="#DC143C" />
          <stop offset="100%" stopColor="#B22222" />
        </linearGradient>
        <linearGradient id="capeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D1B69" />
          <stop offset="100%" stopColor="#1a0033" />
        </linearGradient>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A0E4E" />
          <stop offset="100%" stopColor="#2D1B69" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};