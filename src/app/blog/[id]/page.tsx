'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  EyeIcon,
  ArrowLeftIcon,
  ShareIcon
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
  readTime: string;
  views: number;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (params.id) {
      fetchBlogPost(params.id as string);
    }
  }, [params.id]);

  const fetchBlogPost = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/blog/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.data);
        // Görüntülenme sayısını artır
        incrementViews(id);
        // İlgili yazıları getir
        fetchRelatedPosts(data.data.category, id);
      } else {
        setError('Blog yazısı bulunamadı');
      }
    } catch (error) {
      console.error('Blog yükleme hatası:', error);
      setError('Bağlantı hatası oluştu');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (id: string) => {
    try {
      await fetch(`/api/blog/${id}/view`, { method: 'POST' });
    } catch (error) {
      console.error('Görüntülenme sayısı artırma hatası:', error);
    }
  };

  const fetchRelatedPosts = async (category: string, currentId: string) => {
    try {
      const response = await fetch(`/api/blog?status=published&category=${encodeURIComponent(category)}&limit=3`);
      const data = await response.json();
      
      if (data.success) {
        const filtered = data.data.blogs.filter((blog: any) => blog._id !== currentId);
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('İlgili yazılar yükleme hatası:', error);
    }
  };

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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <TopBar />
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blog Yazısı Bulunamadı</h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Blog'a Dön
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <TopBar />
      <Navbar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center text-orange-400 hover:text-orange-300 mb-8 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Blog'a Dön
        </Link>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full font-medium">
              {post.category}
            </span>
            <div className="flex items-center text-sm text-gray-400">
              <EyeIcon className="h-4 w-4 mr-1" />
              {post.views.toLocaleString()} görüntülenme
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-gray-700 pt-6">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
            </div>

            <button className="flex items-center text-gray-400 hover:text-orange-400 transition-colors">
              <ShareIcon className="h-5 w-5 mr-2" />
              Paylaş
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <div 
            className="text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-white mb-4">Etiketler</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-700 pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">İlgili Yazılar</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost._id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-orange-500/40 transition-all duration-300 group">
                  <div className="h-32 bg-gray-700 relative overflow-hidden">
                    {relatedPost.featuredImage ? (
                      <img 
                        src={relatedPost.featuredImage} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TagIcon className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                      <Link href={`/blog/${relatedPost._id}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {new Date(relatedPost.publishedAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />

      {/* Structured Data */}
      <StructuredData 
        type="website" 
        data={{
          headline: post.title,
          description: post.excerpt,
          author: post.author,
          datePublished: post.publishedAt,
          image: post.featuredImage
        }} 
      />
    </div>
  );
} 