@@ .. @@
       login: async (username: string, passcode: string) => {
         set({ isLoading: true });
         try {
           const { data: users, error } = await supabase
             .from('users')
             .select('*')
             .eq('username', username)
-            .limit(1)
-            .single();
+            .limit(1);
 
-          if (error) {
+          if (error || !users || users.length === 0) {
             set({ isLoading: false });
             return false;
           }
 
-          const isValidPasscode = await bcrypt.compare(passcode, users.passcode_hash);
+          const user = users[0];
+          const isValidPasscode = await bcrypt.compare(passcode, user.passcode_hash);
           if (!isValidPasscode) {
             set({ isLoading: false });
             return false;
           }
 
           // Update online status
           await supabase
             .from('users')
             .update({ is_online: true, last_seen: new Date().toISOString() })
-            .eq('id', users.id);
+            .eq('id', user.id);
 
           set({
-            user: { ...users, is_online: true },
+            user: { ...user, is_online: true },
             isAuthenticated: true,
             isLoading: false,
           });
           return true;
         } catch (error) {
           console.error('Login error:', error);
           set({ isLoading: false });
           return false;
         }
       },
 
       register: async (username: string, passcode: string) => {
         set({ isLoading: true });
         try {
           // Check if username exists
           const { data: existingUsers, error: checkError } = await supabase
             .from('users')
             .select('id')
             .eq('username', username)
             .limit(1);
 
-          if (existingUsers && existingUsers.length > 0) {
+          if (checkError) {
+            console.error('Check error:', checkError);
+          }
+
+          if (existingUsers && existingUsers.length > 0) {
             set({ isLoading: false });
             return false;
           }
 
           const hashedPasscode = await bcrypt.hash(passcode, 12);
           const { data: newUser, error } = await supabase
             .from('users')
             .insert({
               username,
               passcode_hash: hashedPasscode,
               is_online: true,
               last_seen: new Date().toISOString(),
             })
             .select()
-            .single();
+            .limit(1);
 
-          if (error || !newUser) {
+          if (error || !newUser || newUser.length === 0) {
+            console.error('Insert error:', error);
             set({ isLoading: false });
             return false;
           }
 
           set({
-            user: newUser,
+            user: newUser[0],
             isAuthenticated: true,
             isLoading: false,
           });
           return true;
         } catch (error) {
           console.error('Registration error:', error);
           set({ isLoading: false });
           return false;
         }
       },