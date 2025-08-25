@@ .. @@
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
-    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
+    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
       {showBackground && (
-        <div className="absolute inset-0">
-          <div 
-            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
-            style={{
-              backgroundImage: 'url(/IMG-20250818-WA0009.jpg)',
-              backgroundSize: 'cover',
-              backgroundPosition: 'center',
-              backgroundAttachment: 'fixed',
-            }}
-          />
-          <div className={`absolute inset-0 transition-all duration-500 ${
-            isDarkMode 
-              ? 'bg-black/60 backdrop-blur-[1px]' 
-              : 'bg-black/30 backdrop-blur-[0.5px]'
-          }`} />
+        <div className="fixed inset-0 z-0">
+          {/* Gradient Background */}
+          <div className={`absolute inset-0 transition-all duration-500 ${
+            isDarkMode 
+              ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-black' 
+              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
+          }`} />
+          
+          {/* Animated Background Pattern */}
+          <div className={`absolute inset-0 opacity-20 transition-opacity duration-500 ${
+            isDarkMode ? 'opacity-30' : 'opacity-10'
+          }`}>
+            <div className="absolute inset-0" style={{
+              backgroundImage: `radial-gradient(circle at 25% 25%, ${isDarkMode ? '#8B0000' : '#EC4899'} 0%, transparent 50%), 
+                               radial-gradient(circle at 75% 75%, ${isDarkMode ? '#4A0E4E' : '#8B5CF6'} 0%, transparent 50%)`,
+              backgroundSize: '100px 100px',
+              animation: 'float 20s ease-in-out infinite'
+            }} />
+          </div>
+          
+          {/* Overlay */}
+          <div className={`absolute inset-0 transition-all duration-500 ${
+            isDarkMode 
+              ? 'bg-black/20 backdrop-blur-[0.5px]' 
+              : 'bg-white/20 backdrop-blur-[0.5px]'
+          }`} />
         </div>
       )}
+      
       <motion.div 
-        className={`relative z-10 min-h-screen transition-colors duration-500 ${
+        className={`relative z-10 min-h-screen transition-all duration-500 ${
           isDarkMode ? 'text-white' : 'text-gray-900'
         }`}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.3 }}
       >
         {children}
       </motion.div>
+      
+      <style jsx>{`
+        @keyframes float {
+          0%, 100% { transform: translateY(0px) rotate(0deg); }
+          33% { transform: translateY(-10px) rotate(1deg); }
+          66% { transform: translateY(5px) rotate(-1deg); }
+        }
+      `}</style>
     </div>
   );
 };