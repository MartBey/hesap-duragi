'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  EnvelopeIcon,
  UserIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinDate: string;
  lastLogin: string;
  totalPurchases: number;
  balance: number;
  verified: boolean;
  phoneNumber?: string;
  ipAddress?: string;
  userAgent?: string;
  loginHistory?: Array<{
    date: string;
    ip: string;
    device: string;
  }>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createUserData, setCreateUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    // Kullanıcı kontrolü
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      fetchUsers();
    } catch (error) {
      console.error('User data parse error:', error);
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsers();
    }
  }, [currentPage, filterRole, filterStatus, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filterRole !== 'all' && { role: filterRole }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        // API'den gelen veriyi frontend formatına dönüştür
        console.log('API\'den gelen kullanıcı verisi:', data.data.users);
        const formattedUsers = data.data.users.map((user: any) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          joinDate: new Date(user.createdAt).toISOString().split('T')[0],
          lastLogin: user.updatedAt ? new Date(user.updatedAt).toISOString().split('T')[0] : 'Hiç',
          totalPurchases: user.totalPurchases || 0,
          balance: user.balance || 0,
          verified: user.verified || false,
          phoneNumber: user.phoneNumber || '',
          ipAddress: '',
          userAgent: '',
          loginHistory: []
        }));
        
        console.log('Formatlanmış kullanıcı verisi:', formattedUsers);
        setUsers(formattedUsers);
      } else {
        console.error('API Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const user = users.find(u => u._id === userId);
      if (!user) return;

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: userId,
          status: newStatus
        })
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId 
            ? { ...user, status: newStatus as User['status'] }
            : user
        ));
      } else {
        console.error('Status update error:', data.error);
        alert('Durum güncellenirken hata oluştu: ' + data.error);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Durum güncellenirken hata oluştu');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const user = users.find(u => u._id === userId);
      if (!user) return;

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: userId,
          role: newRole
        })
      });

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(user => 
          user._id === userId 
            ? { ...user, role: newRole as User['role'] }
            : user
        ));
      } else {
        console.error('Role update error:', data.error);
        alert('Rol güncellenirken hata oluştu: ' + data.error);
      }
    } catch (error) {
      console.error('Role update error:', error);
      alert('Rol güncellenirken hata oluştu');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`/api/admin/users?id=${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          setUsers(users.filter(user => user._id !== userId));
        } else {
          console.error('Delete error:', data.error);
          alert('Kullanıcı silinirken hata oluştu: ' + data.error);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Kullanıcı silinirken hata oluştu');
      }
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleCreateUser = async () => {
    if (!createUserData.name || !createUserData.email || !createUserData.password) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    setCreateLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createUserData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Kullanıcı başarıyla oluşturuldu!');
        setShowCreateModal(false);
        setCreateUserData({
          name: '',
          email: '',
          password: '',
          role: 'user',
          status: 'active'
        });
        fetchUsers(); // Listeyi yenile
      } else {
        alert('Kullanıcı oluşturulurken hata oluştu: ' + data.error);
      }
    } catch (error) {
      console.error('Create user error:', error);
      alert('Kullanıcı oluşturulurken hata oluştu');
    } finally {
      setCreateLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500';
      case 'suspended': return 'bg-yellow-500/20 text-yellow-500';
      case 'banned': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-500';
      case 'user': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'user': return 'Kullanıcı';
      default: return role;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'suspended': return 'Askıya Alındı';
      case 'banned': return 'Yasaklandı';
      default: return status;
    }
  };

  // Filtreleme fonksiyonu
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <UserIcon className="h-5 w-5" />
              <span>Yeni Kullanıcı</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Aktif Kullanıcı</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Admin</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <ShieldExclamationIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Askıya Alınan</p>
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Roller</option>
              <option value="user">Kullanıcı</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="suspended">Askıya Alındı</option>
              <option value="banned">Yasaklandı</option>
            </select>

            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                {users.length} kullanıcı bulundu
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Bakiye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Son Giriş
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                            {user.verified && (
                              <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        {user.phoneNumber ? (
                          <>
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{user.phoneNumber}</span>
                          </>
                        ) : (
                          <span className="text-gray-500 italic">Belirtilmemiş</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getRoleColor(user.role)}`}
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(user.status)}`}
                      >
                        <option value="active">Aktif</option>
                        <option value="suspended">Askıya Alındı</option>
                        <option value="banned">Yasaklandı</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div>Alım: {user.totalPurchases}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ₺{user.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.lastLogin).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Detayları Görüntüle"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-400 hover:text-yellow-300" title="Düzenle">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-400 hover:text-red-300"
                          title="Sil"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Toplam {filteredUsers.length} kullanıcı
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600">
              Önceki
            </button>
            <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-600">
              Sonraki
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-white">Kullanıcı Detayları</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Temel Bilgiler
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{selectedUser.name}</span>
                        {selectedUser.verified && (
                          <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">{selectedUser.email}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Rol:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getRoleColor(selectedUser.role)}`}>
                        {getRoleText(selectedUser.role)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Durum:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUser.status)}`}>
                        {getStatusText(selectedUser.status)}
                      </span>
                    </div>
                    {selectedUser.phoneNumber && (
                      <div>
                        <span className="text-gray-400">Telefon:</span>
                        <span className="text-white ml-2">{selectedUser.phoneNumber}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Doğrulanmış:</span>
                      <span className="text-white ml-2">{selectedUser.verified ? 'Evet' : 'Hayır'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Hesap İstatistikleri
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-600 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{selectedUser.totalPurchases}</div>
                    <div className="text-sm text-gray-400">Toplam Alım</div>
                  </div>
                  <div className="text-center p-3 bg-gray-600 rounded-lg">
                    <div className="text-2xl font-bold text-orange-400">₺{selectedUser.balance.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Mevcut Bakiye</div>
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Tarih Bilgileri
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kayıt Tarihi:</span>
                    <span className="text-white">{new Date(selectedUser.joinDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Son Giriş:</span>
                    <span className="text-white">{new Date(selectedUser.lastLogin).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              {/* Technical Info */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  Teknik Bilgiler
                </h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">IP Adresi:</span>
                    <span className="text-white ml-2">{selectedUser.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">User Agent:</span>
                    <div className="text-white mt-1 text-xs break-all bg-gray-600 p-2 rounded">
                      {selectedUser.userAgent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Login History */}
              {selectedUser.loginHistory && selectedUser.loginHistory.length > 0 && (
                <div className="lg:col-span-2 bg-gray-700 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    Giriş Geçmişi
                  </h4>
                  <div className="space-y-2">
                    {selectedUser.loginHistory.map((login, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                        <div>
                          <div className="text-white text-sm">{login.device}</div>
                          <div className="text-gray-400 text-xs">{login.ip}</div>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(login.date).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setShowUserModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Kapat
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                Düzenle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Yeni Kullanıcı Oluştur</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={createUserData.name}
                  onChange={(e) => setCreateUserData({...createUserData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Kullanıcının adı ve soyadı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData({...createUserData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="kullanici@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Şifre *
                </label>
                <input
                  type="password"
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData({...createUserData, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="En az 6 karakter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={createUserData.role}
                  onChange={(e) => setCreateUserData({...createUserData, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="user">Kullanıcı</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  value={createUserData.status}
                  onChange={(e) => setCreateUserData({...createUserData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="active">Aktif</option>
                  <option value="suspended">Askıya Alındı</option>
                  <option value="banned">Yasaklandı</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={createLoading}
              >
                İptal
              </button>
              <button
                onClick={handleCreateUser}
                disabled={createLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Oluşturuluyor...</span>
                  </>
                ) : (
                  <span>Oluştur</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 