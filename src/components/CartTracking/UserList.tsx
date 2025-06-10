import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastActivity: Date;
  cartItemCount: number;
  cartValue: number;
  registeredAt: Date;
}

interface UserListProps {
  users: User[];
  selectedUserId: number | null;
  onUserSelect: (userId: number) => void;
  loading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, selectedUserId, onUserSelect, loading }) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} gün önce`;
    if (diffHours > 0) return `${diffHours} saat önce`;
    return 'Az önce';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">👥</span>
          Müşteriler ({users.length})
        </h2>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
        )}
      </div>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Kullanıcı bulunamadı
          </div>
        ) : (
          users.map(user => (
            <div 
              key={user.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedUserId === user.id 
                  ? 'bg-orange-500/20 border border-orange-500/50' 
                  : 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600'
              }`}
              onClick={() => onUserSelect(user.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-white text-sm">{user.name}</div>
                {user.cartItemCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {user.cartItemCount}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mb-1">{user.email}</div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  {formatTimeAgo(user.lastActivity)}
                </span>
                {user.cartValue > 0 && (
                  <span className="text-orange-400 font-medium">
                    ₺{user.cartValue.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;