'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  QuestionMarkCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface HelpContent {
  _id: string;
  type: 'faq' | 'general';
  key: string;
  title: string;
  content: string;
  category?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminHelpContentPage() {
  const router = useRouter();
  const [helpContents, setHelpContents] = useState<HelpContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<'all' | 'faq' | 'general'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<HelpContent | null>(null);
  const [formData, setFormData] = useState({
    type: 'faq' as 'faq' | 'general',
    key: '',
    title: '',
    content: '',
    category: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    const checkAdmin = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
          setIsAdmin(true);
          fetchHelpContents();
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    };

    checkAdmin();
  }, []);

  const fetchHelpContents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const response = await fetch(`/api/admin/help-content${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHelpContents(data.data || []);
      } else {
        console.error('API Error:', response.status);
      }
    } catch (error) {
      console.error('Error fetching help contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingContent 
        ? `/api/admin/help-content/${editingContent._id}`
        : '/api/admin/help-content';
      
      const method = editingContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingContent(null);
        setFormData({
          type: 'faq',
          key: '',
          title: '',
          content: '',
          category: '',
          order: 0,
          isActive: true
        });
        fetchHelpContents();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error saving help content:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleEdit = (content: HelpContent) => {
    setEditingContent(content);
    setFormData({
      type: content.type,
      key: content.key,
      title: content.title,
      content: content.content,
      category: content.category || '',
      order: content.order,
      isActive: content.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu içeriği silmek istediğinizden emin misiniz?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/help-content/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchHelpContents();
      } else {
        alert('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Error deleting help content:', error);
      alert('Bir hata oluştu');
    }
  };

  const openAddModal = () => {
    setEditingContent(null);
    setFormData({
      type: 'faq',
      key: '',
      title: '',
      content: '',
      category: '',
      order: 0,
      isActive: true
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchHelpContents();
    }
  }, [filter, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Yetki kontrol ediliyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Admin Panel
              </Link>
              <div className="text-gray-400">/</div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <QuestionMarkCircleIcon className="h-8 w-8 text-orange-400 mr-3" />
                Yardım İçerik Yönetimi
              </h1>
            </div>
            <button
              onClick={openAddModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Yeni İçerik</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setFilter('faq')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'faq'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-2" />
                FAQ
              </button>
              <button
                onClick={() => setFilter('general')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'general'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                Genel
              </button>
            </div>
          </div>

          {/* Content List */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="text-gray-400">Yükleniyor...</div>
              </div>
            ) : helpContents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Tip</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Başlık</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Key</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Kategori</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Sıra</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Durum</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {helpContents.map((content) => (
                      <tr key={content._id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            content.type === 'faq' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {content.type === 'faq' ? 'FAQ' : 'Genel'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                          {content.title}
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                          {content.key}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {content.category || '-'}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {content.order}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            content.isActive 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {content.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(content)}
                              className="text-orange-400 hover:text-orange-300 p-1"
                              title="Düzenle"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(content._id)}
                              className="text-red-400 hover:text-red-300 p-1"
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
            ) : (
              <div className="p-8 text-center">
                <QuestionMarkCircleIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  İçerik bulunamadı
                </h3>
                <p className="text-gray-500">
                  Henüz hiç yardım içeriği eklenmemiş.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingContent ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tip
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'faq' | 'general' })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="faq">FAQ</option>
                    <option value="general">Genel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Key (Benzersiz)
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="ornek-key"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="İçerik başlığı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  İçerik
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="İçerik metni"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kategori (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Kategori"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.isActive.toString()}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {editingContent ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 