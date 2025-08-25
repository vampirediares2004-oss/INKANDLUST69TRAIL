import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, UserPlus } from 'lucide-react';
import { useFriendStore } from '../../store/friendStore';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export const RequestsList: React.FC = () => {
  const { friendRequests, sentRequests, fetchFriendRequests, acceptFriendRequest, declineFriendRequest } = useFriendStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchFriendRequests(user.id);
    }
  }, [user, fetchFriendRequests]);

  const handleAccept = async (requestId: string) => {
    await acceptFriendRequest(requestId);
  };

  const handleDecline = async (requestId: string) => {
    await declineFriendRequest(requestId);
  };

  return (
    <div className="space-y-6">
      {/* Received Requests */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Friend Requests</h2>
        {friendRequests.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friendRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {request.sender?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{request.sender?.username}</p>
                      <p className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAccept(request.id)}
                      className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200"
                    >
                      <Check className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDecline(request.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sent Requests */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Sent Requests</h2>
        {sentRequests.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300">No pending sent requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sentRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {request.receiver?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{request.receiver?.username}</p>
                    <p className="text-sm text-gray-600">
                      Sent {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};