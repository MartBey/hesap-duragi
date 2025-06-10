'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  TagIcon, 
  ArrowLeftIcon,
  ShoppingBagIcon,
  StarIcon,
  EyeIcon
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
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isOnSale: boolean;
  isFeatured: boolean;
  category: string;
  subcategory: string;
  features: string[];
  emoji: string;
  images: string[];
  status: string;
  rating: number;
  reviews: number;
  stock: number;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
      fetchProducts();
    }
  }, [categoryId]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [selectedSubcategory, category]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${categoryId}`);
      
      if (!response.ok) {
        throw new Error('Kategori bulunamadı');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCategory(data.data);
      } else {
        setError(data.message || 'Kategori yüklenemedi');
      }
    } catch (error) {
      console.error('Kategori getirme hatası:', error);
      setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      
      if (!category) {
        setProducts([]);
        return;
      }
      
      let url = `/api/accounts?category=${category.title}&limit=20`;
      
      if (selectedSubcategory !== 'all') {
        url += `&subcategory=${selectedSubcategory}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.accounts || data.data || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Ürünler getirme hatası:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Kategori yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <TopBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <TagIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Kategori Bulunamadı
            </h3>
            <p className="text-gray-500 mb-4">
              {error || 'Aradığınız kategori mevcut değil.'}
            </p>
            <Link 
              href="/categories"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Kategorilere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeSubcategories = category.subcategories?.filter(sub => sub.isActive) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <TopBar />
      <Navbar />
      
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/categories"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Kategorilere Dön
            </Link>
          </div>

          {/* Category Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-orange-500/30">
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {category.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5" />
                  {category.itemCount} ürün
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                  {category.type === 'account' ? 'Hesap' : 'Lisans'}
                </span>
              </div>
            </div>
          </div>

          {/* Subcategory Filters */}
          {activeSubcategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Alt Kategoriler</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSubcategory === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                  }`}
                >
                  Tümü ({category.itemCount})
                </button>
                {activeSubcategories
                  .sort((a, b) => a.order - b.order)
                  .map((subcategory) => (
                    <button
                      key={subcategory._id}
                      onClick={() => setSelectedSubcategory(subcategory.slug)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedSubcategory === subcategory.slug
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      }`}
                      title={subcategory.description}
                    >
                      {subcategory.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {productsLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Ürünler yükleniyor...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBagIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Ürün Bulunamadı
              </h3>
              <p className="text-gray-500">
                {selectedSubcategory === 'all' 
                  ? 'Bu kategoride henüz ürün bulunmuyor.' 
                  : 'Bu alt kategoride henüz ürün bulunmuyor.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/10">
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl">
                          {product.emoji}
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isOnSale && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            %{product.discountPercentage} İndirim
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Öne Çıkan
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      {product.rating > 0 && (
                        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm font-medium">
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features */}
                      {product.features && product.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 2).map((feature, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                            {product.features.length > 2 && (
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                                +{product.features.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-orange-500">
                              ₺{product.price}
                            </span>
                            {product.isOnSale && product.originalPrice > product.price && (
                              <span className="text-sm text-gray-400 line-through">
                                ₺{product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.reviews > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <EyeIcon className="h-3 w-3" />
                              {product.reviews} değerlendirme
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors group-hover:bg-orange-600">
                          İncele
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

      <Footer />
    </div>
  );
} 