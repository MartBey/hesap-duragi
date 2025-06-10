'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  QuestionMarkCircleIcon,
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface SupportTicket {
  _id: string;
  ticketId: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'general';
  user: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
  };
  responses: Array<{
    _id: string;
    message: string;
    isAdmin: boolean;
    author: {
      name: string;
      email: string;
    };
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface TicketStats {
  total: number;
  byStatus: Array<{ _id: string; count: number }>;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats>({ total: 0, byStatus: [] });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('fetchTickets - Token:', token ? 'Mevcut' : 'Yok');
      console.log('fetchTickets - User:', user);
      
      if (!token) {
        console.log('Token yok, login sayfasına yönlendiriliyor');
        router.push('/login');
        return;
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      console.log('API çağrısı yapılıyor:', `/api/admin/support?${params}`);
      console.log('Headers:', {
        'Authorization': `Bearer ${token.substring(0, 20)}...`,
        'Content-Type': 'application/json'
      });

      const response = await fetch(`/api/admin/support?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched tickets:', data);
        setTickets(data.tickets || []);
        setStats(data.stats || { total: 0, byStatus: [] });
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0
        }));
      } else {
        const errorData = await response.json();
        console.error('API Error:', response.status, errorData);
        if (response.status === 401 || response.status === 403) {
          console.log('Yetki hatası, login sayfasına yönlendiriliyor');
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await fetchTickets();
      } else {
        const errorData = await response.json();
        console.error('Error updating ticket:', errorData);
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const sendResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/support/${selectedTicket._id}/response`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: responseMessage })
      });

      if (response.ok) {
        setResponseMessage('');
        setShowResponseModal(false);
        await fetchTickets();
      } else {
        const errorData = await response.json();
        console.error('Error sending response:', errorData);
      }
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Açık';
      case 'in-progress': return 'İşlemde';
      case 'resolved': return 'Çözüldü';
      case 'closed': return 'Kapalı';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    // Admin kontrolü
    const checkAdmin = () => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      console.log('Admin kontrol - User:', user);
      console.log('Admin kontrol - Token:', token ? 'Mevcut' : 'Yok');
      
      // JWT token'ı decode et (test için)
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          console.log('Decoded JWT:', decoded);
        } catch (error) {
          console.error('JWT decode hatası:', error);
        }
      }
      
      if (user && token) {
        const userData = JSON.parse(user);
        console.log('User data:', userData);
        
        if (userData.role === 'admin') {
          console.log('Admin yetkisi onaylandı');
          setIsAdmin(true);
        } else {
          console.log('Admin yetkisi yok, ana sayfaya yönlendiriliyor');
          router.push('/');
        }
      } else {
        console.log('User veya token eksik, login sayfasına yönlendiriliyor');
        router.push('/login');
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchTickets();
    }
  }, [pagination.page, filters, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Yetki kontrol ediliyor...</div>
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
                <QuestionMarkCircleIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Destek Yönetimi</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <TicketIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Toplam Bilet</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          
          {stats.byStatus.map((stat) => (
            <div key={stat._id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center">
                {stat._id === 'open' && <ClockIcon className="h-8 w-8 text-blue-500" />}
                {stat._id === 'in-progress' && <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-500" />}
                {stat._id === 'resolved' && <CheckCircleIcon className="h-8 w-8 text-green-500" />}
                {stat._id === 'closed' && <XMarkIcon className="h-8 w-8 text-gray-500" />}
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">{getStatusText(stat._id)}</p>
                  <p className="text-2xl font-bold text-white">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Bilet ara..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Tüm Durumlar</option>
              <option value="open">Açık</option>
              <option value="in-progress">İşlemde</option>
              <option value="resolved">Çözüldü</option>
              <option value="closed">Kapalı</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Tüm Öncelikler</option>
              <option value="urgent">Acil</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="technical">Teknik</option>
              <option value="billing">Faturalama</option>
              <option value="account">Hesap</option>
              <option value="general">Genel</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Bilet ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Konu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                      Destek bileti bulunamadı
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        #{ticket.ticketId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{ticket.user.name}</div>
                          <div className="text-sm text-gray-400">{ticket.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowResponseModal(true);
                            }}
                            className="p-1 text-blue-400 hover:text-blue-300"
                            title="Görüntüle ve Yanıtla"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          
                          {ticket.status !== 'closed' && (
                            <select
                              value={ticket.status}
                              onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                              className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-orange-500"
                            >
                              <option value="open">Açık</option>
                              <option value="in-progress">İşlemde</option>
                              <option value="resolved">Çözüldü</option>
                              <option value="closed">Kapalı</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Önceki
              </button>
              
              <span className="px-3 py-2 bg-gray-800 text-white rounded-lg">
                {pagination.page} / {pagination.pages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.pages) }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Bilet #{selectedTicket.ticketId} - {selectedTicket.subject}
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-white">{selectedTicket.user.name}</p>
                    <p className="text-sm text-gray-400">{selectedTicket.user.email}</p>
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <p className="text-gray-300">{selectedTicket.message}</p>
              </div>

              {selectedTicket.responses.map((response) => (
                <div
                  key={response._id}
                  className={`rounded-lg p-4 ${
                    response.isAdmin ? 'bg-orange-500/20 ml-8' : 'bg-gray-700 mr-8'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-white">{response.author.name}</p>
                      <p className="text-sm text-gray-400">
                        {response.isAdmin ? 'Admin' : 'Kullanıcı'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">{formatDate(response.createdAt)}</p>
                  </div>
                  <p className="text-gray-300">{response.message}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-4">
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Yanıtınızı yazın..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  İptal
                </button>
                <button
                  onClick={sendResponse}
                  disabled={!responseMessage.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>Yanıtla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 