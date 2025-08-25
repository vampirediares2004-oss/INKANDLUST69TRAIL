@@ .. @@
 import React from 'react';
 import { motion } from 'framer-motion';
 
-export const VampireLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
+interface VampireLogoProps {
+  className?: string;
+  animate?: boolean;
+}
+
+export const VampireLogo: React.FC<VampireLogoProps> = ({ 
+  className = "w-8 h-8", 
+  animate = true 
+}) => {
   return (
     <motion.svg
       className={className}
       viewBox="0 0 100 100"
       fill="none"
       xmlns="http://www.w3.org/2000/svg"
-      initial={{ rotate: 0 }}
-      animate={{ rotate: 360 }}
-      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
+      initial={animate ? { rotate: 0 } : false}
+      animate={animate ? { rotate: 360 } : false}
+      transition={animate ? { duration: 20, repeat: Infinity, ease: "linear" } : undefined}
     >
-      {/* Vampire head silhouette */}
+      {/* Main vampire head */}
       <path
-        d="M50 10C35 10 25 20 25 35C25 45 30 50 35 55L40 65C42 70 45 75 50 75C55 75 58 70 60 65L65 55C70 50 75 45 75 35C75 20 65 10 50 10Z"
+        d="M50 15C38 15 30 23 30 35C30 42 33 47 37 52L42 62C44 67 47 70 50 70C53 70 56 67 58 62L63 52C67 47 70 42 70 35C70 23 62 15 50 15Z"
         fill="url(#vampireGradient)"
+        stroke="url(#strokeGradient)"
+        strokeWidth="1"
       />
       
-      {/* Vampire fangs */}
+      {/* Sharp vampire fangs */}
       <path
-        d="M42 45L45 55L48 45Z"
+        d="M43 42L46 52L49 42Z"
         fill="#ffffff"
+        stroke="#e5e5e5"
+        strokeWidth="0.5"
       />
       <path
-        d="M52 45L55 55L58 45Z"
+        d="M51 42L54 52L57 42Z"
         fill="#ffffff"
+        stroke="#e5e5e5"
+        strokeWidth="0.5"
       />
       
-      {/* Eyes (glowing red) */}
-      <circle cx="42" cy="35" r="3" fill="#ff0000" opacity="0.8" />
-      <circle cx="58" cy="35" r="3" fill="#ff0000" opacity="0.8" />
+      {/* Glowing red eyes */}
+      <circle cx="43" cy="32" r="2.5" fill="#ff0000" opacity="0.9">
+        <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" />
+      </circle>
+      <circle cx="57" cy="32" r="2.5" fill="#ff0000" opacity="0.9">
+        <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" />
+      </circle>
+      
+      {/* Eye highlights */}
+      <circle cx="44" cy="31" r="0.8" fill="#ff6666" opacity="0.8" />
+      <circle cx="58" cy="31" r="0.8" fill="#ff6666" opacity="0.8" />
       
-      {/* Cape/collar */}
+      {/* Gothic collar/cape */}
       <path
-        d="M25 35C25 30 30 25 35 25L65 25C70 25 75 30 75 35L75 40C70 38 60 36 50 36C40 36 30 38 25 40Z"
+        d="M28 35C28 28 32 22 38 22L62 22C68 22 72 28 72 35L72 42C67 40 58 38 50 38C42 38 33 40 28 42Z"
         fill="url(#capeGradient)"
+        stroke="url(#strokeGradient)"
+        strokeWidth="0.8"
       />
       
-      {/* Bat wings */}
+      {/* Gothic bat wings */}
       <path
-        d="M20 40C15 35 10 40 15 45C20 50 25 45 25 40"
+        d="M18 38C12 32 8 38 12 44C16 50 22 46 25 40C24 39 22 38 18 38Z"
         fill="url(#wingGradient)"
+        stroke="url(#strokeGradient)"
+        strokeWidth="0.5"
       />
       <path
-        d="M80 40C85 35 90 40 85 45C80 50 75 45 75 40"
+        d="M82 38C88 32 92 38 88 44C84 50 78 46 75 40C76 39 78 38 82 38Z"
         fill="url(#wingGradient)"
+        stroke="url(#strokeGradient)"
+        strokeWidth="0.5"
       />
       
+      {/* Gothic details */}
+      <path
+        d="M50 25L48 28L52 28Z"
+        fill="#8B0000"
+        opacity="0.6"
+      />
+      
       <defs>
+        {/* Enhanced gradients */}
         <linearGradient id="vampireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
-          <stop offset="0%" stopColor="#8B0000" />
-          <stop offset="50%" stopColor="#DC143C" />
-          <stop offset="100%" stopColor="#B22222" />
+          <stop offset="0%" stopColor="#4A0E4E" />
+          <stop offset="30%" stopColor="#8B0000" />
+          <stop offset="70%" stopColor="#DC143C" />
+          <stop offset="100%" stopColor="#2D1B69" />
         </linearGradient>
+        
         <linearGradient id="capeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
-          <stop offset="0%" stopColor="#2D1B69" />
-          <stop offset="100%" stopColor="#1a0033" />
+          <stop offset="0%" stopColor="#1a0033" />
+          <stop offset="50%" stopColor="#2D1B69" />
+          <stop offset="100%" stopColor="#0F0C29" />
         </linearGradient>
+        
         <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
-          <stop offset="0%" stopColor="#4A0E4E" />
-          <stop offset="100%" stopColor="#2D1B69" />
+          <stop offset="0%" stopColor="#2D1B69" />
+          <stop offset="50%" stopColor="#4A0E4E" />
+          <stop offset="100%" stopColor="#1a0033" />
+        </linearGradient>
+        
+        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
+          <stop offset="0%" stopColor="#8B0000" />
+          <stop offset="100%" stopColor="#4A0E4E" />
         </linearGradient>
       </defs>
     </motion.svg>
   );
 };