'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PuzzlePieceIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import CartIcon from '@/components/CartIcon';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Account {
  _id: string;
  title: string;
  description: string;
  game: string;
  price: number;
  originalPrice: number;
  category: string;
  features: string[];
  emoji: string;
  images: string[];
  status: string;
  level: number;
  rank: string;
  rating: number;
  reviews: number;
  stock: number;
  discountPercentage: number;
  isOnSale: boolean;
}

interface Category {
  _id: string;
  title: string;
  type: string;
}

export default function ProductsPage() {
  const { addToCart } = useCart();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const games = [
    'Counter-Strike 2',
    'Valorant',
    'League of Legends',
    'Apex Legends',
    'World of Warcraft',
    'Fortnite',
    'PUBG',
    'Overwatch 2',
    'Rocket League',
    'FIFA 24'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [searchTerm, selectedCategory, selectedGame, sortBy, sortOrder, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?type=account');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedGame) params.append('game', selectedGame);

      const response = await fetch(`/api/accounts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAccounts(data.data.accounts);
        setTotalPages(data.data.totalPages);
        setTotalAccounts(data.data.totalAccounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAccounts();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedGame('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleAddToCart = (account: Account) => {
    addToCart({
      _id: account._id,
      title: account.title,
      price: account.price,
      emoji: account.emoji || '🎮',
      images: account.images || [],
      category: account.category || 'Oyun',
      game: account.game || 'Oyun'
    });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative"
      style={{
        backgroundImage: 'url("/public/arka plan 2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {/* TopBar and Navbar */}
        <TopBar />
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tüm Ürünler</h1>
            <p className="text-gray-400">
              {totalAccounts > 0 ? `${totalAccounts} hesap bulundu` : 'Hesap bulunamadı'}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Hesap ara..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtreler
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kategori
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Tüm Kategoriler</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Game Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Oyun
                    </label>
                    <select
                      value={selectedGame}
                      onChange={(e) => setSelectedGame(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">Tüm Oyunlar</option>
                      {games.map((game) => (
                        <option key={game} value={game}>
                          {game}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sırala
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="createdAt">Tarih</option>
                      <option value="price">Fiyat</option>
                      <option value="rating">Puan</option>
                      <option value="title">İsim</option>
                    </select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sıralama
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="desc">Azalan</option>
                      <option value="asc">Artan</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 animate-pulse">
                  <div className="bg-gray-700 rounded-lg h-48 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-700 rounded-full w-16"></div>
                      <div className="h-6 bg-gray-700 rounded-full w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : accounts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {accounts.map((account) => (
                  <div key={account._id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:scale-105">
                    <div className="mb-4">
                      <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center mb-4 relative overflow-hidden">
                        {account.images && account.images.length > 0 ? (
                          <img 
                            src={account.images[0]} 
                            alt={account.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">{account.emoji || '🎮'}</span>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                            {account.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-white line-clamp-2">
                          {account.title}
                        </h4>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{account.game}</p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < Math.floor(account.rating) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs ml-2">
                          ({account.rating})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            Level {account.level}
                          </span>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            {account.rank}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        {account.isOnSale && account.discountPercentage > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl font-bold text-orange-500">
                                ₺{account.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ₺{account.originalPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                              %{account.discountPercentage} İndirim
                            </div>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-orange-500">
                            ₺{account.price.toLocaleString()}
                          </span>
                        )}
                        <div className="text-sm text-gray-400 mt-2">
                          Stok: {account.stock} adet
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        href={`/products/${account._id}`}
                        className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm text-center"
                      >
                        Detayları Gör
                      </Link>
                      <button
                        onClick={() => handleAddToCart(account)}
                        className="flex items-center justify-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        title="Sepete Ekle"
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Önceki
                  </button>

                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              page === currentPage
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-800 border border-gray-600 text-white hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-3 py-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <PuzzlePieceIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Hesap Bulunamadı</h3>
              <p className="text-gray-400 mb-6">
                Aradığınız kriterlere uygun hesap bulunamadı.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
} 