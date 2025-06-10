'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarIcon, 
  UserIcon, 
  EyeIcon,
  ArrowRightIcon,
  ChatBubbleLeftIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: string;
  views: number;
  likes: number;
  readTime: string;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog?status=published&limit=3');
      const data = await response.json();
      if (data.success && data.data.blogs.length > 0) {
        const posts = data.data.blogs || data.data || [];
        setBlogPosts(posts);
      } else {
        // API'den veri gelmezse sample data kullan
        const sampleResponse = await fetch('/data/sample-blogs.json');
        const sampleData = await sampleResponse.json();
        
        // Sample data'yı Blog modeline uygun formata çevir
        const formattedSampleData = sampleData.map((blog: any) => ({
          ...blog,
          category: getCategoryFromTags(blog.tags),
          readTime: '5 dakika',
          likes: blog.comments || 0,
          publishedAt: blog.publishDate,
          createdAt: blog.publishDate,
          updatedAt: blog.publishDate
        }));
        
        setBlogPosts(formattedSampleData.slice(0, 3));
      }
    } catch (error) {
      console.error('Blog yazıları getirme hatası:', error);
      // Hata durumunda da sample data kullanmayı dene
      try {
        const sampleResponse = await fetch('/data/sample-blogs.json');
        const sampleData = await sampleResponse.json();
        
        const formattedSampleData = sampleData.map((blog: any) => ({
          ...blog,
          category: getCategoryFromTags(blog.tags),
          readTime: '5 dakika',
          likes: blog.comments || 0,
          publishedAt: blog.publishDate,
          createdAt: blog.publishDate,
          updatedAt: blog.publishDate
        }));
        
        setBlogPosts(formattedSampleData.slice(0, 3));
      } catch (sampleError) {
        console.error('Sample data yükleme hatası:', sampleError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryFromTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return 'Genel';
    
    const categoryMap: { [key: string]: string } = {
      'valorant': 'Valorant',
      'cs2': 'Counter-Strike',
      'counter-strike': 'Counter-Strike',
      'lol': 'League of Legends',
      'league-of-legends': 'League of Legends',
      'pubg-mobile': 'PUBG Mobile',
      'fps': 'FPS Oyunları',
      'moba': 'MOBA Oyunları',
      'battle-royale': 'Battle Royale',
      'güvenlik': 'Güvenlik',
      'e-spor': 'E-Spor',
      'rehber': 'Rehberler',
      'strateji': 'Strateji'
    };
    
    for (const tag of tags) {
      if (categoryMap[tag.toLowerCase()]) {
        return categoryMap[tag.toLowerCase()];
      }
    }
    
    return tags[0].charAt(0).toUpperCase() + tags[0].slice(1);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'rgba(255, 102, 0, 0.11)'}}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">📝</div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Blog & Haberler
              </h2>
              <p className="text-gray-400 mt-2">
                Oyun dünyasından son haberler ve rehberler
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-700"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-700 rounded mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <div className="h-3 bg-gray-700 rounded w-12"></div>
                      <div className="h-3 bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="h-8 bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <article
                  key={post._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300 group"
                >
                  {/* Featured Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-500/20 to-purple-600/20 overflow-hidden">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl opacity-50">📰</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-orange-400">
                        <span className="text-xs">⏱️</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt || truncateText(post.content.replace(/<[^>]*>/g, ''), 120)}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full flex items-center space-x-1"
                          >
                            <TagIcon className="h-3 w-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <EyeIcon className="h-4 w-4" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ChatBubbleLeftIcon className="h-4 w-4" />
                          <span>{post.likes || 0}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug || post._id}`}
                        className="flex items-center space-x-1 text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
                      >
                        <span>Devamını Oku</span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>Tüm Blog Yazılarını Gör</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">Henüz Blog Yazısı Yok</h3>
            <p className="text-gray-400 mb-6">Yakında oyun dünyasından haberler ve rehberler burada olacak!</p>
            
            {/* Demo Blog Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "Valorant Yeni Sezon Rehberi",
                  excerpt: "Valorant yeni sezonunda rank atlamak için en etkili stratejiler ve ipuçları.",
                  category: "Valorant",
                  readTime: "5 dakika",
                  date: "20 Aralık 2024",
                  author: "HesapDurağı Editörü",
                  views: "1250",
                  comments: "23"
                },
                {
                  title: "CS:GO'dan CS2'ye Geçiş Rehberi",
                  excerpt: "Counter-Strike 2 ile gelen yenilikler ve geçiş sürecinde bilmeniz gerekenler.",
                  category: "Counter-Strike",
                  readTime: "5 dakika",
                  date: "19 Aralık 2024",
                  author: "Pro Gamer",
                  views: "890",
                  comments: "15"
                },
                {
                  title: "League of Legends Sezon 14 Meta Analizi",
                  excerpt: "League of Legends Sezon 14'te öne çıkan şampiyonlar ve meta değişiklikleri.",
                  category: "League of Legends",
                  readTime: "5 dakika",
                  date: "18 Aralık 2024",
                  author: "LoL Uzmanı",
                  views: "2100",
                  comments: "45"
                }
              ].map((demo, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500/50 transition-all duration-300 group"
                >
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                      {demo.category}
                    </span>
                  </div>

                  {/* Featured Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl opacity-30">📰</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span>📅</span>
                          <span>{demo.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>👤</span>
                          <span>{demo.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-orange-400">
                        <span>⏱️</span>
                        <span>{demo.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {demo.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {demo.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <span>👁️</span>
                          <span>{demo.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{demo.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors cursor-pointer">
                        <span>Devamını Oku</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection; 