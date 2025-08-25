@@ .. @@
           className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 cursor-pointer hover:bg-white/95 transition-all duration-200"
         >
           <div className="flex items-center space-x-4">
             {/* Chat Avatar */}
             <div className="relative">
-              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
+              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                 {chat.is_group ? (
                   <Users className="w-6 h-6 text-white" />
                 ) : (
                   <span className="text-white font-bold text-lg">
                     {chat.name?.charAt(0).toUpperCase() || 'C'}
                   </span>
                 )}
               </div>
+              {/* Online indicator */}
+              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
             </div>
 
             {/* Chat Info */}
             <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-1">
-                <h3 className="font-semibold text-gray-900 truncate">
+                <h3 className="font-semibold text-gray-900 truncate text-lg">
                   {chat.name || 'Private Chat'}
                 </h3>
                 {chat.last_message && (
-                  <span className="text-xs text-gray-500">
+                  <span className="text-xs text-gray-500 font-medium">
                     {formatDistanceToNow(new Date(chat.last_message.created_at), { addSuffix: true })}
                   </span>
                 )}
               </div>
               
               {chat.last_message && (
                 <div className="flex items-center space-x-1">
                   {chat.last_message.message_type === 'image' && (
                     <Image className="w-4 h-4 text-gray-500" />
                   )}
-                  <p className="text-sm text-gray-600 truncate">
+                  <p className="text-sm text-gray-600 truncate font-medium">
                     {chat.last_message.message_type === 'image' 
                       ? 'Photo' 
                       : chat.last_message.content
                     }
                   </p>
                 </div>
               )}
             </div>
           </div>
         </motion.div>
       ))}
     </div>
   );
 };