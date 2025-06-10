import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import PopularCategory from '@/models/PopularCategory';

export const dynamic = 'force-dynamic';

// GET - Popüler kategorileri getir
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const popularCategories = await PopularCategory.find({})
      .sort({ order: 1 });

    // Eğer veritabanında veri yoksa boş array döndür
    if (popularCategories.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    return NextResponse.json({
      success: true,
      data: popularCategories
    });

  } catch (error: any) {
    console.error('Popular Categories GET Error:', error);
    
    // Hata durumunda boş array döndür
    return NextResponse.json({
      success: true,
      data: []
    });
  }
}

// POST - Popüler kategorileri kaydet (Admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('POST isteği alındı');
    
    // MongoDB bağlantısını kontrol et
    try {
      await connectDB();
      console.log('MongoDB bağlantısı başarılı');
    } catch (dbError) {
      console.error('MongoDB bağlantı hatası:', dbError);
      return NextResponse.json(
        { error: 'Veritabanı bağlantı hatası' },
        { status: 500 }
      );
    }

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token bulunamadı');
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      console.log('Token doğrulandı:', decoded.role);
    } catch (error) {
      console.log('Token doğrulama hatası:', error);
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü (basit kontrol)
    if (decoded.role !== 'admin') {
      console.log('Admin yetkisi yok:', decoded.role);
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const requestBody = await request.json();
    console.log('Gelen veri:', requestBody);
    
    const { categories } = requestBody;

    if (!categories || !Array.isArray(categories)) {
      console.log('Geçersiz kategori verisi:', categories);
      return NextResponse.json(
        { error: 'Geçersiz kategori verisi' },
        { status: 400 }
      );
    }

    console.log('Kategoriler işleniyor, toplam:', categories.length);

    // Mevcut kategorileri sil
    const deleteResult = await PopularCategory.deleteMany({});
    console.log('Silinen kategori sayısı:', deleteResult.deletedCount);

    // _id alanlarını temizle (MongoDB otomatik oluşturacak)
    const cleanCategories = categories.map(cat => {
      const { _id, ...cleanCat } = cat;
      return cleanCat;
    });

    console.log('Temizlenmiş kategoriler:', cleanCategories);

    // Yeni kategorileri ekle
    const savedCategories = await PopularCategory.insertMany(cleanCategories);
    console.log('Kaydedilen kategori sayısı:', savedCategories.length);

    return NextResponse.json({
      success: true,
      message: 'Popüler kategoriler başarıyla kaydedildi',
      data: savedCategories
    });

  } catch (error: any) {
    console.error('Popular Categories POST Error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Sunucu hatası: ' + error.message,
        details: error.stack 
      },
      { status: 500 }
    );
  }
} 