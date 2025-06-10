'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  featured: boolean;
  image?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string>('');

  const categories = ['all', 'Oyun Rehberleri', 'Güvenlik', 'Sosyal Medya', 'Dijital Hizmetler', 'PC Oyunları'];

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = '/api/blog?status=published&limit=20';
      if (selectedCategory !== 'all') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        const blogs = data.data.blogs || [];
        // Blog verilerini frontend formatına dönüştür
        const formattedBlogs = blogs.map((blog: any) => ({
          _id: blog._id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          author: blog.author,
          category: blog.category,
          tags: blog.tags || [],
          publishedAt: blog.publishedAt || blog.createdAt,
          readTime: parseInt(blog.readTime?.replace(' dakika', '') || '5'),
          views: blog.views || 0,
          featured: blog.status === 'published' && blog.views > 1000, // Popüler yazıları öne çıkar
          image: blog.featuredImage || ''
        }));
        setPosts(formattedBlogs);
      } else {
        setError('Blog yazıları yüklenemedi');
        setPosts([]);
      }
    } catch (error) {
      console.error('Blog yükleme hatası:', error);
      setError('Bağlantı hatası oluştu');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const featuredPosts = posts.filter(post => post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <TopBar />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <TopBar />
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Oyun ve Dijital Dünya Rehberi
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Oyun hesapları, dijital ürünler ve güvenlik konularında en güncel bilgiler ve rehberler
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Öne Çıkan Yazılar</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article key={post._id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 group">
                  <div className="h-48 bg-gray-700 relative overflow-hidden">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TagIcon className="h-16 w-16 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full font-medium">
                        Öne Çıkan
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                      <ClockIcon className="h-4 w-4 ml-4 mr-2" />
                      {post.readTime} dk okuma
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      <Link href={`/blog/${post._id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-400">
                        <UserIcon className="h-4 w-4 mr-2" />
                        {post.author}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            {selectedCategory === 'all' ? 'Tüm Yazılar' : selectedCategory}
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          {filteredPosts.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <TagIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {selectedCategory === 'all' ? 'Henüz blog yazısı yok' : `${selectedCategory} kategorisinde yazı bulunamadı`}
              </h3>
              <p className="text-gray-500">
                Yakında yeni içerikler eklenecek.
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post._id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500/40 transition-all duration-300 group">
                <div className="h-48 bg-gray-700 relative overflow-hidden">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TagIcon className="h-16 w-16 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gray-800/80 text-white text-sm rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                    <ClockIcon className="h-4 w-4 ml-4 mr-2" />
                    {post.readTime} dk okuma
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                    <Link href={`/blog/${post._id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <UserIcon className="h-4 w-4 mr-2" />
                      {post.author}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-16 bg-gray-800/30 rounded-lg p-8 border border-orange-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Güvenilir Dijital Hesap Mağazası ve Dijital Ürünler Hakkında Bilmeniz Gerekenler
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-3">🎮 Dijital Oyun Hesapları</h3>
              <p className="text-gray-300 mb-4">
                <strong>LOL hesap satın al</strong>, <strong>Valorant hesap satın al</strong> ve diğer dijital hesaplar 
                konusunda güvenli alışveriş rehberleri. Güvenilir dijital hesap mağazasından alışveriş ipuçları.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• League of Legends dijital hesap rehberleri</li>
                <li>• Valorant güvenlik ipuçları</li>
                <li>• PUBG Mobile UC güvenli satın alma</li>
                <li>• Steam dijital hesap yönetimi</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-3">📱 Dijital Hizmetler</h3>
              <p className="text-gray-300 mb-4">
                <strong>Instagram takipçi satın al</strong>, <strong>Netflix hesap satın al</strong> ve sosyal medya 
                büyütme stratejileri. Dijital ürünler ve premium hesaplar hakkında detaylı bilgiler.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Sosyal medya büyütme rehberleri</li>
                <li>• Premium dijital hesap kullanım ipuçları</li>
                <li>• Güvenilir dijital mağaza ödeme yöntemleri</li>
                <li>• Dijital hesap paylaşımı güvenliği</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Structured Data */}
      <StructuredData type="website" data={{}} />
    </div>
  );
} 