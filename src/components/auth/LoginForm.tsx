@@ .. @@
         className="w-full max-w-md relative z-10"
       >
-        <div className={`backdrop-blur-md rounded-3xl shadow-2xl p-8 border transition-all duration-500 ${
+        <div className={`backdrop-blur-xl rounded-3xl shadow-2xl p-8 border transition-all duration-500 ${
           isDarkMode 
-            ? 'bg-black/40 border-purple-500/30 shadow-purple-500/20' 
-            : 'bg-white/90 border-white/20 shadow-black/20'
+            ? 'bg-black/60 border-purple-500/40 shadow-purple-500/30' 
+            : 'bg-white/95 border-white/30 shadow-black/10'
         }`}>
           {/* Logo */}
           <div className="text-center mb-8">
             <div className="flex items-center justify-center mb-4 space-x-3">
-              <VampireLogo className="w-12 h-12" />
+              <VampireLogo className="w-16 h-16" animate={true} />
               <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                 INKANDLUST69
               </h1>
             </div>
             <p className={`mt-2 transition-colors duration-500 ${
               isDarkMode ? 'text-gray-300' : 'text-gray-600'
             }`}>Private & Secure Messaging</p>
           </div>
@@ .. @@
               className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                 isDarkMode 
-                  ? 'bg-black/30 border-gray-600 text-white placeholder-gray-400' 
-                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
+                  ? 'bg-black/40 border-gray-600 text-white placeholder-gray-400' 
+                  : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500'
               }`}
               placeholder="Enter your username"
               disabled={isLoading}
@@ .. @@
                   className={`w-full px-4 py-3 pr-12 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ${
                     isDarkMode 
-                      ? 'bg-black/30 border-gray-600 text-white placeholder-gray-400' 
-                      : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
+                      ? 'bg-black/40 border-gray-600 text-white placeholder-gray-400' 
+                      : 'bg-white/90 border-gray-300 text-gray-900 placeholder-gray-500'
                   }`}
                   placeholder="Enter your passcode"
                   disabled={isLoading}