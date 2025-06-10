import connectDB from '../lib/mongodb';
import Category from '../models/Category';

const tiktokSubcategories = [
  {
    name: 'İzlenme',
    slug: 'izlenme',
    description: 'TikTok video izlenme hizmetleri',
    isActive: true,
    order: 1
  },
  {
    name: 'Beğenme',
    slug: 'begenme',
    description: 'TikTok video beğenme hizmetleri',
    isActive: true,
    order: 2
  },
  {
    name: 'Takipçi',
    slug: 'takipci',
    description: 'TikTok takipçi artırma hizmetleri',
    isActive: true,
    order: 3
  },
  {
    name: 'Yorum',
    slug: 'yorum',
    description: 'TikTok video yorum hizmetleri',
    isActive: true,
    order: 4
  },
  {
    name: 'Paylaşım',
    slug: 'paylasim',
    description: 'TikTok video paylaşım hizmetleri',
    isActive: true,
    order: 5
  },
  {
    name: 'Jeton',
    slug: 'jeton',
    description: 'TikTok jeton ve coin hizmetleri',
    isActive: true,
    order: 6
  },
  {
    name: 'Canlı Yayın',
    slug: 'canli-yayin',
    description: 'TikTok canlı yayın izleyici hizmetleri',
    isActive: true,
    order: 7
  }
];

async function addTikTokSubcategories() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await connectDB();
    console.log('✅ MongoDB bağlantısı başarılı!');

    // TikTok kategorisini bul
    const tiktokCategory = await Category.findOne({ title: 'TikTok' });
    
    if (!tiktokCategory) {
      console.log('❌ TikTok kategorisi bulunamadı!');
      return;
    }

    console.log('📝 TikTok kategorisi bulundu:', tiktokCategory.title);

    // Alt kategorileri ekle
    tiktokCategory.subcategories = tiktokSubcategories;
    await tiktokCategory.save();

    console.log('✅ TikTok alt kategorileri başarıyla eklendi!');
    console.log('📋 Eklenen alt kategoriler:');
    tiktokSubcategories.forEach((sub, index) => {
      console.log(`   ${index + 1}. ${sub.name} (${sub.slug})`);
    });

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
  } finally {
    process.exit(0);
  }
}

// Script'i çalıştır
addTikTokSubcategories(); 