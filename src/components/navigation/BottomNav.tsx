@@ .. @@
   return (
-    <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t px-4 py-2 z-50 transition-all duration-500 ${
+    <div className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-4 py-3 z-50 transition-all duration-500 ${
       isDarkMode 
-        ? 'bg-black/40 border-purple-500/30' 
-        : 'bg-white/90 border-gray-200'
+        ? 'bg-black/70 border-purple-500/40' 
+        : 'bg-white/95 border-gray-200'
     }`}>
-      <div className="flex justify-around items-center max-w-md mx-auto">
+      <div className="flex justify-around items-center max-w-lg mx-auto">
         {tabs.map((tab) => {
           const Icon = tab.icon;
           const isActive = activeTab === tab.id;
           
           return (
             <motion.button
               key={tab.id}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => onTabChange(tab.id)}
-              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
+              className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 min-w-0 ${
                 isActive 
                   ? isDarkMode 
                     ? 'text-pink-400 bg-pink-400/20' 
                     : 'text-pink-600 bg-pink-50'
                   : isDarkMode 
                     ? 'text-gray-400 hover:text-gray-200' 
                     : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               <Icon className={`w-6 h-6 ${
                 isActive 
                   ? isDarkMode ? 'text-pink-400' : 'text-pink-600' 
                   : ''
               }`} />
-              <span className="text-xs font-medium">{tab.label}</span>
+              <span className="text-xs font-medium truncate">{tab.label}</span>
               {isActive && (
                 <motion.div
                   layoutId="activeTab"
-                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
+                  className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 rounded-full ${
                     isDarkMode ? 'bg-pink-400' : 'bg-pink-600'
                   }`}
                 />
               )}
             </motion.button>
           );
         })}
       </div>
     </div>
   );
 };