'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  TagIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

interface Category {
  _id: string;
  title: string;
  image: string;
  type: 'account' | 'license';
  status: 'active' | 'inactive';
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'account' | 'license'>('all');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Categories sayfası - API çağrısı başlatılıyor...');
      
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories API response:', data);
      
      if (data.success) {
        // API'den gelen veri yapısını kontrol et
        const categoriesData = data.data.categories || data.data || [];
        console.log('Categories data:', categoriesData);
        console.log('Categories count:', categoriesData.length);
        
        // Sadece aktif kategorileri göster
        const activeCategories = categoriesData.filter((cat: Category) => cat.status === 'active');
        console.log('Active categories:', activeCategories);
        console.log('Active categories count:', activeCategories.length);
        
        setCategories(activeCategories);
        
        if (activeCategories.length === 0) {
          setError('Aktif kategori bulunamadı');
        }
      } else {
        console.error('Categories API başarısız:', data.error);
        setError(data.error || 'Kategoriler yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    if (filter === 'all') return true;
    return category.type === filter;
  });

  const getTypeColor = (type: string) => {
    return type === 'account' 
      ? 'from-blue-500 to-purple-500' 
      : 'from-green-500 to-teal-500';
  };

  const getTypeLabel = (type: string) => {
    return type === 'license' ? 'LİSANS' : null;
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
        
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <TagIcon className="h-12 w-12 text-orange-500 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Kategoriler
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              İhtiyacınız olan hesap ve lisansları keşfedin. 
              Her kategori için özenle seçilmiş ürünler sizi bekliyor.
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-1">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    Tümü ({categories.length})
                  </button>
                  <button
                    onClick={() => setFilter('account')}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      filter === 'account'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    Hesaplar ({categories.filter(c => c.type === 'account').length})
                  </button>
                  <button
                    onClick={() => setFilter('license')}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      filter === 'license'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    Lisanslar ({categories.filter(c => c.type === 'license').length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-pulse">
                    <div className="bg-gray-700 rounded-lg h-48 mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-full"></div>
                      <div className="h-10 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <TagIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-400 mb-2">
                  Hata Oluştu
                </h3>
                <p className="text-gray-500 mb-4">
                  {error}
                </p>
                <button
                  onClick={fetchCategories}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <TagIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Kategori bulunamadı
                </h3>
                <p className="text-gray-500">
                  {filter === 'all' 
                    ? 'Henüz hiç kategori eklenmemiş.' 
                    : `${filter === 'account' ? 'Hesap' : 'Lisans'} kategorisi bulunamadı.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category._id}`}
                    className="group"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10">
                      {/* Category Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Type Badge - Sadece lisans kategorilerinde göster */}
                        {category.type === 'license' && (
                          <div className="absolute top-4 left-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getTypeColor(category.type)} shadow-lg`}>
                              {getTypeLabel(category.type)}
                            </span>
                          </div>
                        )}
                        
                        {/* Product Count */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-sm font-medium">
                            {category.itemCount} ürün
                          </span>
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-1">
                          {category.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-300 text-sm">
                            <ShoppingBagIcon className="h-4 w-4 mr-2" />
                            <span>{category.itemCount} ürün</span>
                          </div>
                          
                          <div className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors group-hover:bg-orange-600">
                            Keşfet →
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {categories.reduce((total, cat) => total + cat.itemCount, 0)}+
                  </div>
                  <div className="text-gray-300">Toplam Ürün</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {categories.length}
                  </div>
                  <div className="text-gray-300">Kategori</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {categories.filter(c => c.type === 'account').length}
                  </div>
                  <div className="text-gray-300">Hesap Kategorisi</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {categories.filter(c => c.type === 'license').length}
                  </div>
                  <div className="text-gray-300">Lisans Kategorisi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Aradığınız Kategoriyi Bulamadınız mı?
              </h2>
              <p className="text-orange-100 mb-6 text-lg">
                Özel istekleriniz için bizimle iletişime geçin. Size özel çözümler sunabiliriz.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
} 