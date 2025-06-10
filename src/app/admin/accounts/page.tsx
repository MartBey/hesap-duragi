'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PuzzlePieceIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import EmojiPicker from '@/components/EmojiPicker';
import ImageUpload from '@/components/ImageUpload';

interface Account {
  _id: string;
  title: string;
  game?: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isOnSale: boolean;
  isFeatured: boolean;
  isWeeklyDeal?: boolean;
  category: string;
  emoji: string;
  images: string[];
  status: 'available' | 'sold' | 'pending' | 'suspended';
  seller: {
    _id: string;
    name: string;
  };
  level: string;
  rank: string;
  rating: number;
  reviews: number;
  stock: number;
  description?: string;
  features?: string[];
  createdAt: string;
}

interface Category {
  _id: string;
  title: string;
  icon: string;
  type: 'account' | 'license';
  status: 'active' | 'inactive';
  itemCount: number;
  subcategories?: Array<{
    _id: string;
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
    order: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('🎮');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    category: '',
    subcategory: '',
    price: '',
    discountPercentage: '',
    isOnSale: false,
    isFeatured: false,
    level: '',
    rank: '',
    stock: '',
    description: '',
    features: [] as string[]
  });
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, [currentPage, filterCategory, filterStatus, searchTerm]);



  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories?limit=50&status=active&type=account');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.categories) {
          setCategories(data.data.categories);
        }
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    setLoadingSubcategories(true);
    try {
      const response = await fetch(`/api/categories/${categoryId}/subcategories`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubcategories(data.data || []);
        } else {
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Alt kategoriler yüklenirken hata:', error);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleCategoryChange = (categoryTitle: string) => {
    setFormData({...formData, category: categoryTitle, subcategory: ''});
    
    // Kategori ID'sini bul
    const selectedCategory = categories.find(cat => cat.title === categoryTitle);
    if (selectedCategory) {
      fetchSubcategories(selectedCategory._id);
    } else {
      setSubcategories([]);
    }
  };



  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/accounts');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.accounts) {
          setAccounts(result.data.accounts);
        } else {
          setAccounts([]);
        }
      } else {
        console.error('Hesaplar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account);
    setShowViewModal(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setFormData({
      title: account.title,
      game: account.game || '',
      category: account.category,
      subcategory: (account as any).subcategory || '',
      price: account.price.toString(),
      discountPercentage: account.discountPercentage?.toString() || '0',
      isOnSale: account.isOnSale || false,
      isFeatured: account.isFeatured || false,
      level: account.level,
      rank: account.rank,
      stock: account.stock.toString(),
      description: account.description || '',
      features: account.features || []
    });
    setSelectedEmoji(account.emoji);
    setSelectedImages(account.images || []);
    
    // Mevcut kategorinin alt kategorilerini yükle
    const selectedCategory = categories.find(cat => cat.title === account.category);
    if (selectedCategory) {
      fetchSubcategories(selectedCategory._id);
    }
    
    setShowEditModal(true);
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm('Bu hesabı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/accounts?accountId=${accountId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Hesap başarıyla silindi!');
          fetchAccounts();
        } else {
          alert('Hesap silinirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Hesap silme hatası:', error);
        alert('Hesap silinirken bir hata oluştu.');
      }
    }
  };

  const handleStatusChange = async (accountId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          updates: { status: newStatus }
        }),
      });

      if (response.ok) {
        setAccounts(accounts.map(account => 
          account._id === accountId 
            ? { ...account, status: newStatus as Account['status'] }
            : account
        ));
      } else {
        alert('Durum güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const handleWeeklyDealToggle = async (accountId: string, isWeeklyDeal: boolean) => {
    try {
      console.log('Toggling weekly deal:', { accountId, isWeeklyDeal });
      
      const response = await fetch('/api/admin/weekly-deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          isWeeklyDeal
        }),
      });

      const result = await response.json();
      console.log('Weekly deal toggle response:', result);

      if (response.ok) {
        setAccounts(accounts.map(account => 
          account._id === accountId 
            ? { ...account, isWeeklyDeal: isWeeklyDeal }
            : account
        ));
        alert(result.message);
        // Hesapları yeniden yükle
        fetchAccounts();
      } else {
        console.error('Weekly deal toggle failed:', result);
        alert(`Hata: ${result.error || 'Haftanın fırsatları güncellenirken bir hata oluştu.'}`);
      }
    } catch (error) {
      console.error('Haftanın fırsatları güncelleme hatası:', error);
      alert('Haftanın fırsatları güncellenirken bir hata oluştu.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-500';
      case 'sold': return 'bg-gray-500/20 text-gray-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'suspended': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Mevcut';
      case 'sold': return 'Satıldı';
      case 'pending': return 'Beklemede';
      case 'suspended': return 'Askıya Alındı';
      default: return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const accountData = {
        ...formData,
        emoji: selectedEmoji,
        images: selectedImages,
        price: parseFloat(formData.price),
        discountPercentage: parseFloat(formData.discountPercentage),
        isOnSale: formData.isOnSale,
        isFeatured: formData.isFeatured,
        level: formData.level,
        stock: parseInt(formData.stock),
        originalPrice: formData.isOnSale ? 
          parseFloat(formData.price) / (1 - parseFloat(formData.discountPercentage) / 100) :
          parseFloat(formData.price) * 1.2, // İndirimli ise gerçek orijinal fiyat, değilse %20 fazla
        game: formData.game // Game alanı da gerekli
      };

      const isEdit = showEditModal && selectedAccount;
      const url = isEdit ? '/api/admin/accounts' : '/api/admin/accounts';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit 
        ? JSON.stringify({ accountId: selectedAccount._id, updates: accountData })
        : JSON.stringify(accountData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        alert(isEdit ? 'Hesap başarıyla güncellendi!' : 'Hesap başarıyla eklendi!');
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedAccount(null);
        // Formu sıfırla
        setFormData({
          title: '',
          game: '',
          category: '',
          subcategory: '',
          price: '',
          discountPercentage: '',
          isOnSale: false,
          isFeatured: false,
          level: '',
          rank: '',
          stock: '',
          description: '',
          features: []
        });
        setSelectedEmoji('🎮');
        setSelectedImages([]);
        // Hesapları yeniden yükle
        fetchAccounts();
      } else {
        alert(isEdit ? 'Hesap güncellenirken bir hata oluştu.' : 'Hesap eklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Hesap işlemi hatası:', error);
      alert('İşlem sırasında bir hata oluştu.');
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || account.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Hesaplar yükleniyor...</p>
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
                <PuzzlePieceIcon className="h-8 w-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-white">Hesap Yönetimi</h1>
              </div>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Yeni Hesap Ekle</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Haftanın Fırsatları Yönetimi */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-6 mb-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FireIcon className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-bold text-white">Haftanın Fırsatları Yönetimi</h2>
            </div>
            <Link 
              href="/haftanin-firsatlari"
              target="_blank"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Sayfayı Görüntüle
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-orange-400">
                {accounts.filter(account => account.isWeeklyDeal).length}
              </div>
              <div className="text-sm text-gray-400">Aktif Fırsat</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">
                ₺{accounts
                  .filter(account => account.isWeeklyDeal)
                  .reduce((sum, account) => sum + account.price, 0)
                  .toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Toplam Değer</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-sm text-gray-300 mb-2">Hızlı İşlemler:</div>
              <div className="text-xs text-gray-400">
                🔥 simgesine tıklayarak ürünleri haftanın fırsatlarına ekleyebilir/çıkarabilirsiniz
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
                placeholder="Hesap ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Kategoriler</option>
              {categories
                .filter(category => category.status === 'active' && category.type === 'account')
                .map((category) => (
                  <option key={category._id} value={category.title}>
                    {category.icon} {category.title}
                  </option>
                ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="available">Mevcut</option>
              <option value="sold">Satıldı</option>
              <option value="pending">Beklemede</option>
              <option value="suspended">Askıya Alındı</option>
            </select>

            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400 text-sm">
                {filteredAccounts.length} hesap bulundu
              </span>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Hesap
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Emoji
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Fotoğraflar
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Stok
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Satıcı
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Tarih
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAccounts.map((account) => (
                  <tr key={account._id} className="hover:bg-gray-800/30">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{account.title}</div>
                        <div className="text-xs text-gray-500">
                          Level {account.level} • {account.rank}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {account.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">
                              ⭐ Öne Çıkan
                            </span>
                          )}
                          {account.isOnSale && account.discountPercentage > 0 && (
                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">
                              🔥 %{account.discountPercentage} İndirim
                            </span>
                          )}
                          {account.isWeeklyDeal && (
                            <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full font-medium">
                              🔥 Haftanın Fırsatı
                            </span>
                          )}
                        </div>
                        <div className="sm:hidden text-xs text-gray-400 mt-1">
                          {account.emoji} • {account.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center hidden sm:table-cell">
                      <span className="text-xl">{account.emoji}</span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        {account.images && account.images.length > 0 ? (
                          <>
                            <div className="w-6 h-6 rounded overflow-hidden border border-gray-600">
                              <img 
                                src={account.images[0]} 
                                alt="Ana fotoğraf" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {account.images.length > 1 && (
                              <span className="text-xs text-gray-400">+{account.images.length - 1}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-500 rounded-full">
                        {account.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-white">₺{account.price.toLocaleString()}</div>
                      {account.originalPrice > account.price && (
                        <div className="text-xs text-gray-400 line-through">
                          ₺{account.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-white">{account.stock} adet</div>
                      {account.stock === 0 && (
                        <div className="text-xs text-red-400">Tükendi</div>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <select
                        value={account.status}
                        onChange={(e) => handleStatusChange(account._id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(account.status)}`}
                      >
                        <option value="available">Mevcut</option>
                        <option value="sold">Satıldı</option>
                        <option value="pending">Beklemede</option>
                        <option value="suspended">Askıya Alındı</option>
                      </select>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">
                      {account.seller.name}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-400 hidden lg:table-cell">
                      {new Date(account.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => handleWeeklyDealToggle(account._id, !account.isWeeklyDeal)}
                          className={`p-1 transition-colors ${
                            account.isWeeklyDeal 
                              ? 'text-orange-400 hover:text-orange-300' 
                              : 'text-gray-400 hover:text-orange-400'
                          }`}
                          title={account.isWeeklyDeal ? 'Haftanın fırsatlarından çıkar' : 'Haftanın fırsatlarına ekle'}
                        >
                          <FireIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleViewAccount(account)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                          title="Görüntüle"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditAccount(account)}
                          className="text-yellow-400 hover:text-yellow-300 p-1"
                          title="Düzenle"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAccount(account._id)}
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
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-400">
            Toplam {filteredAccounts.length} hesap
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

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Yeni Hesap Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Hesap Başlığı</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Hesap başlığı"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Platform/Uygulama</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Instagram, TikTok, LinkedIn, Steam vb."
                    value={formData.game}
                    onChange={(e) => setFormData({...formData, game: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Kategori</label>
                  <select 
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {categories.length > 0 ? (
                      categories
                        .filter(category => category.status === 'active' && category.type === 'account')
                        .map((category) => (
                          <option key={category._id} value={category.title}>
                            {category.icon} {category.title}
                          </option>
                        ))
                    ) : (
                      <option value="" disabled>Kategoriler yükleniyor...</option>
                    )}
                  </select>
                </div>
                
                {/* Alt Kategori Seçimi */}
                {formData.category && (
                  <div>
                    <label className="form-label">Alt Kategori (Opsiyonel)</label>
                    <select 
                      className="form-input"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      disabled={loadingSubcategories}
                    >
                      <option value="">Alt kategori seçin</option>
                      {loadingSubcategories ? (
                        <option value="" disabled>Alt kategoriler yükleniyor...</option>
                      ) : (
                        subcategories
                          .filter(sub => sub.isActive)
                          .sort((a, b) => a.order - b.order)
                          .map((subcategory) => (
                            <option key={subcategory._id} value={subcategory.slug}>
                              {subcategory.name}
                            </option>
                          ))
                      )}
                    </select>
                    {subcategories.length === 0 && !loadingSubcategories && formData.category && (
                      <p className="text-sm text-gray-400 mt-1">Bu kategori için alt kategori bulunmuyor</p>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Emoji</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 form-input" 
                      value={selectedEmoji}
                      readOnly
                      placeholder="Emoji seçin" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(true)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      {selectedEmoji} Seç
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Fiyat (₺)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Stok Sayısı</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="1"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              {/* Özel Ayarlar */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-4">Özel Ayarlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isFeatured" className="text-white font-medium">
                      Öne Çıkan Ürün
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isOnSale"
                      checked={formData.isOnSale}
                      onChange={(e) => setFormData({...formData, isOnSale: e.target.checked})}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isOnSale" className="text-white font-medium">
                      İndirimde
                    </label>
                  </div>
                  
                  {formData.isOnSale && (
                    <div className="md:col-span-2">
                      <label className="form-label">İndirim Oranı (%)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="10"
                        min="0"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                        required={formData.isOnSale}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Fotoğraf Yükleme */}
              <div>
                <label className="form-label">Fotoğraflar (0/5)</label>
                <ImageUpload
                  images={selectedImages}
                  onImagesChange={setSelectedImages}
                  maxImages={5}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Seviye/Değer</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="40, 10K takipçi, Premium vb."
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Durum/Özellik</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Doğrulanmış, Premium, VIP vb."
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Açıklama</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="Hesap açıklaması"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-700">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary order-2 sm:order-1"
                >
                  İptal
                </button>
                <button type="submit" className="btn-primary order-1 sm:order-2">
                  Hesap Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Hesap Düzenle</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Hesap Başlığı</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Hesap başlığı"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="form-label">Platform/Uygulama</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Instagram, TikTok, LinkedIn, Steam vb."
                    value={formData.game}
                    onChange={(e) => setFormData({...formData, game: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Kategori</label>
                  <select 
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {categories.length > 0 ? (
                      categories
                        .filter(category => category.status === 'active' && category.type === 'account')
                        .map((category) => (
                          <option key={category._id} value={category.title}>
                            {category.icon} {category.title}
                          </option>
                        ))
                    ) : (
                      <option value="" disabled>Kategoriler yükleniyor...</option>
                    )}
                  </select>
                </div>
                
                {/* Alt Kategori Seçimi */}
                {formData.category && (
                  <div>
                    <label className="form-label">Alt Kategori (Opsiyonel)</label>
                    <select 
                      className="form-input"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      disabled={loadingSubcategories}
                    >
                      <option value="">Alt kategori seçin</option>
                      {loadingSubcategories ? (
                        <option value="" disabled>Alt kategoriler yükleniyor...</option>
                      ) : (
                        subcategories
                          .filter(sub => sub.isActive)
                          .sort((a, b) => a.order - b.order)
                          .map((subcategory) => (
                            <option key={subcategory._id} value={subcategory.slug}>
                              {subcategory.name}
                            </option>
                          ))
                      )}
                    </select>
                    {subcategories.length === 0 && !loadingSubcategories && formData.category && (
                      <p className="text-sm text-gray-400 mt-1">Bu kategori için alt kategori bulunmuyor</p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="form-label">Fiyat (₺)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="1000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Stok Sayısı</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="1"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              {/* Özel Ayarlar */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-4">Özel Ayarlar</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isFeaturedEdit"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isFeaturedEdit" className="text-white font-medium">
                      Öne Çıkan Ürün
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isOnSaleEdit"
                      checked={formData.isOnSale}
                      onChange={(e) => setFormData({...formData, isOnSale: e.target.checked})}
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isOnSaleEdit" className="text-white font-medium">
                      İndirimde
                    </label>
                  </div>
                  
                  {formData.isOnSale && (
                    <div className="md:col-span-2">
                      <label className="form-label">İndirim Oranı (%)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        placeholder="10"
                        min="0"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
                        required={formData.isOnSale}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Seviye/Değer</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="40, 10K takipçi, Premium vb."
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Durum/Özellik</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Doğrulanmış, Premium, VIP vb."
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Açıklama</label>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="Hesap açıklaması"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-700">
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAccount(null);
                  }}
                  className="btn-secondary order-2 sm:order-1"
                >
                  İptal
                </button>
                <button type="submit" className="btn-primary order-1 sm:order-2">
                  Hesap Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Account Modal */}
      {showViewModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Hesap Detayları</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Hesap Başlığı</label>
                  <p className="text-white">{selectedAccount.title}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Platform/Uygulama</label>
                  <p className="text-white">{selectedAccount.game}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Kategori</label>
                  <p className="text-white">{selectedAccount.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Fiyat</label>
                  <p className="text-white">₺{selectedAccount.price.toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Stok Sayısı</label>
                  <p className="text-white">{selectedAccount.stock} adet</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">İndirim Durumu</label>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      selectedAccount.isOnSale ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {selectedAccount.isOnSale ? `%${selectedAccount.discountPercentage} İndirim` : 'İndirim Yok'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Durum</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedAccount.status)}`}>
                    {getStatusText(selectedAccount.status)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Seviye/Değer</label>
                  <p className="text-white">{selectedAccount.level}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Durum/Özellik</label>
                  <p className="text-white">{selectedAccount.rank}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Emoji</label>
                  <p className="text-2xl">{selectedAccount.emoji}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-400">Oluşturulma Tarihi</label>
                  <p className="text-white">{new Date(selectedAccount.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
            </div>
            
            {selectedAccount.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-400">Açıklama</label>
                <p className="text-white mt-2">{selectedAccount.description}</p>
              </div>
            )}
            
            {selectedAccount.images && selectedAccount.images.length > 0 && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-400">Fotoğraflar</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {selectedAccount.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-600">
                      <img 
                        src={image} 
                        alt={`Hesap fotoğrafı ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn-secondary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={(emoji) => setSelectedEmoji(emoji)}
        selectedEmoji={selectedEmoji}
      />
    </div>
  );
} 