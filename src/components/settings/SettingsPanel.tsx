@@ .. @@
       {/* Profile Header */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
-        className={`backdrop-blur-md rounded-3xl p-6 text-center transition-all duration-500 ${
+        className={`backdrop-blur-xl rounded-3xl p-6 text-center transition-all duration-500 ${
           isDarkMode 
-            ? 'bg-black/40 border border-purple-500/30' 
-            : 'bg-white/90 border border-white/20'
+            ? 'bg-black/60 border border-purple-500/40' 
+            : 'bg-white/95 border border-white/30'
         }`}
       >
-        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
+        <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
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
@@ .. @@
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: groupIndex * 0.1 }}
-          className={`backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-500 ${
+          className={`backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 ${
             isDarkMode 
-              ? 'bg-black/40 border border-purple-500/30' 
-              : 'bg-white/90 border border-white/20'
+              ? 'bg-black/60 border border-purple-500/40' 
+              : 'bg-white/95 border border-white/30'
           }`}
         >
           <h3 className={`text-lg font-semibold p-4 border-b transition-colors duration-500 ${
             isDarkMode 
               ? 'text-white border-gray-700' 
               : 'text-gray-900 border-gray-100'
           }`}>
             {group.title}
           </h3>
@@ .. @@
             onClick={(e) => e.stopPropagation()}
-            className={`rounded-3xl p-6 w-full max-w-sm backdrop-blur-md transition-all duration-500 ${
+            className={`rounded-3xl p-6 w-full max-w-sm backdrop-blur-xl transition-all duration-500 ${
               isDarkMode 
-                ? 'bg-black/80 border border-purple-500/30' 
-                : 'bg-white/95 border border-white/20'
+                ? 'bg-black/80 border border-purple-500/40' 
+                : 'bg-white/95 border border-white/30'
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
-                  ? 'bg-black/30 border-gray-600 text-white placeholder-gray-400' 
-                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
+                  ? 'bg-black/40 border-gray-600 text-white placeholder-gray-400' 
+                  : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500'
               }`}
               maxLength={50}
             />