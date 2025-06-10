'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  TagIcon, 
  ArrowLeftIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
}

interface Category {
  _id: string;
  title: string;
  image: string;
  type: 'account' | 'license';
  status: 'active' | 'inactive';
  itemCount: number;
  subcategories: Subcategory[];
}

interface SubcategoryFormData {
  name: string;
  description: string;
  isActive: boolean;
}

export default function SubcategoriesPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<SubcategoryFormData>({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
      fetchSubcategories();
    }
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      const data = await response.json();
      
      if (data.success) {
        setCategory(data.data);
      } else {
        setError('Kategori bulunamadı');
      }
    } catch (error) {
      console.error('Kategori getirme hatası:', error);
      setError('Kategori getirilemedi');
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${categoryId}/subcategories`);
      const data = await response.json();
      
      if (data.success) {
        setSubcategories(data.data || []);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Alt kategoriler getirme hatası:', error);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    if (!formData.name.trim()) {
      setError('Alt kategori adı gereklidir');
      setSubmitting(false);
      return;
    }
    
    try {
      const url = `/api/categories/${categoryId}/subcategories`;
      const method = editingSubcategory ? 'PUT' : 'POST';
      
      const payload = editingSubcategory 
        ? { ...formData, subcategoryId: editingSubcategory._id }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message || 'Alt kategori başarıyla kaydedildi');
        setShowModal(false);
        setEditingSubcategory(null);
        setFormData({ name: '', description: '', isActive: true });
        fetchSubcategories();
      } else {
        setError(data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Alt kategori kaydetme hatası:', error);
      setError('Bağlantı hatası oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description || '',
      isActive: subcategory.isActive
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleDelete = async (subcategoryId: string) => {
    if (!confirm('Bu alt kategoriyi silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/categories/${categoryId}/subcategories?subcategoryId=${subcategoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Alt kategori başarıyla silindi');
        fetchSubcategories();
      } else {
        setError(data.message || 'Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Alt kategori silme hatası:', error);
      setError('Bağlantı hatası oluştu');
    }
  };

  const toggleActive = async (subcategory: Subcategory) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/subcategories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subcategoryId: subcategory._id,
          name: subcategory.name,
          description: subcategory.description,
          isActive: !subcategory.isActive
        })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchSubcategories();
      } else {
        setError(data.message || 'Durum değiştirme başarısız');
      }
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
      setError('Bağlantı hatası oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Alt kategoriler yükleniyor...</p>
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
              <Link href="/admin/categories" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-3">
                {category && (
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {category?.title} Alt Kategorileri
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Alt kategori yönetimi
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingSubcategory(null);
                setFormData({ name: '', description: '', isActive: true });
                setError('');
                setSuccess('');
                setShowModal(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Yeni Alt Kategori
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Subcategories Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {subcategories.length === 0 ? (
            <div className="p-8 text-center">
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Henüz alt kategori bulunmuyor</p>
              <button
                onClick={() => {
                  setEditingSubcategory(null);
                  setFormData({ name: '', description: '', isActive: true });
                  setError('');
                  setSuccess('');
                  setShowModal(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                İlk Alt Kategoriyi Oluştur
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Alt Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Sıra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {subcategories
                    .sort((a, b) => a.order - b.order)
                    .map((subcategory) => (
                    <tr key={subcategory._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{subcategory.name}</div>
                          <div className="text-sm text-gray-400">/{subcategory.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs">
                          {subcategory.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(subcategory)}
                          className={`flex items-center gap-2 px-3 py-1 text-xs rounded-full transition-colors ${
                            subcategory.isActive
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          }`}
                        >
                          {subcategory.isActive ? (
                            <>
                              <EyeIcon className="h-3 w-3" />
                              Aktif
                            </>
                          ) : (
                            <>
                              <EyeSlashIcon className="h-3 w-3" />
                              Pasif
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {subcategory.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(subcategory)}
                            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Düzenle"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subcategory._id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
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
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {editingSubcategory ? 'Alt Kategori Düzenle' : 'Yeni Alt Kategori'}
            </h3>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alt Kategori Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Örn: İzlenme, Beğenme, Takipçi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Açıklama (Opsiyonel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Alt kategori açıklaması"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                  Aktif
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {submitting 
                    ? 'Kaydediliyor...' 
                    : editingSubcategory ? 'Güncelle' : 'Oluştur'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 