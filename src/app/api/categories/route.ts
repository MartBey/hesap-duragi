import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

interface Category {
  _id: string;
  title: string;
  icon?: string;
  image?: string;
  type: 'account' | 'license';
  itemCount: number;
}

// Mock kategoriler - fallback için
const mockCategories = [
  { _id: '1', title: 'Instagram', image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 25, createdAt: new Date(), updatedAt: new Date() },
  { _id: '2', title: 'Gmail', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 18, createdAt: new Date(), updatedAt: new Date() },
  { _id: '3', title: 'Twitter', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 32, createdAt: new Date(), updatedAt: new Date() },
  { _id: '4', title: 'Hotmail', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 15, createdAt: new Date(), updatedAt: new Date() },
  { _id: '5', title: 'Facebook', image: 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 22, createdAt: new Date(), updatedAt: new Date() },
  { _id: '6', title: 'Outlook', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 12, createdAt: new Date(), updatedAt: new Date() },
  { _id: '7', title: 'TikTok', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop', type: 'account', status: 'active', itemCount: 28, createdAt: new Date(), updatedAt: new Date() },
  { _id: '8', title: 'Semrush', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 8, createdAt: new Date(), updatedAt: new Date() },
  { _id: '9', title: 'WP Pro', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 14, createdAt: new Date(), updatedAt: new Date() },
  { _id: '10', title: 'Canva', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 19, createdAt: new Date(), updatedAt: new Date() },
  { _id: '11', title: 'Windows', image: 'https://images.unsplash.com/photo-1633114128174-2f8aa49759b0?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 11, createdAt: new Date(), updatedAt: new Date() },
  { _id: '12', title: 'Adobe', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 16, createdAt: new Date(), updatedAt: new Date() },
  { _id: '13', title: 'Elementor Pro', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 7, createdAt: new Date(), updatedAt: new Date() },
  { _id: '14', title: 'CapCut', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop', type: 'license', status: 'active', itemCount: 9, createdAt: new Date(), updatedAt: new Date() }
];

export async function GET(request: NextRequest) {
  try {
    console.log('Categories API çağrıldı - MongoDB\'den veri çekmeye zorlanıyor');
    
    // MongoDB bağlantısını timeout ile dene
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 5000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('✅ MongoDB bağlantısı başarılı!');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'account' veya 'license'
    const limit = parseInt(searchParams.get('limit') || '20');

    let query: any = { status: 'active' };
    
    if (type) {
      query.type = type;
    }

    console.log('Kategoriler veritabanından çekiliyor...');
    const categories = await Category.find(query)
      .limit(limit)
      .lean();

    console.log(`✅ ${categories.length} kategori bulundu`);

    if (categories.length === 0) {
      console.log('Veritabanında kategori bulunamadı, mock data döndürülüyor');
      const filteredMockCategories = type 
        ? mockCategories.filter(cat => cat.type === type)
        : mockCategories;
      
      return NextResponse.json({
        success: true,
        data: {
          categories: filteredMockCategories.slice(0, limit)
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((category: any) => ({
          _id: category._id.toString(),
          title: category.title,
          image: category.image,
          type: category.type,
          status: category.status,
          itemCount: category.itemCount || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }))
      }
    });

  } catch (error: any) {
    console.error('❌ Categories API Error:', error);
    console.error('Error details:', error.message);
    
    // Hata durumunda fallback'e geç
    console.log('MongoDB hatası, fallback moda geçiliyor');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const filteredMockCategories = type 
      ? mockCategories.filter(cat => cat.type === type)
      : mockCategories;
    
    return NextResponse.json({
      success: true,
      data: {
        categories: filteredMockCategories.slice(0, limit)
      }
    });
  }
} 