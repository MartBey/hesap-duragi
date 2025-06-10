import dotenv from 'dotenv';
import connectDB from '../lib/mongodb';
import Category from '../models/Category';
import Account from '../models/Account';
import User from '../models/User';

// Load environment variables
dotenv.config({ path: '.env.local' });

const seedCategories = [
  // Hesap kategorileri
  { title: 'Instagram', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png', type: 'account', status: 'active', itemCount: 45 },
  { title: 'Gmail', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png', type: 'account', status: 'active', itemCount: 32 },
  { title: 'Twitter', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png', type: 'account', status: 'active', itemCount: 28 },
  { title: 'Hotmail', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/512px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png', type: 'account', status: 'active', itemCount: 19 },
  { title: 'Facebook', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/512px-Facebook_Logo_%282019%29.png', type: 'account', status: 'active', itemCount: 37 },
  { title: 'Outlook', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/512px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png', type: 'account', status: 'active', itemCount: 24 },
  { title: 'TikTok', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/512px-TikTok_logo.svg.png', type: 'account', status: 'active', itemCount: 41 },
  { title: 'YouTube', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png', type: 'account', status: 'active', itemCount: 0 },
  { title: 'LinkedIn', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/512px-LinkedIn_logo_initials.png', type: 'account', status: 'active', itemCount: 0 },
  { title: 'Discord', image: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png', type: 'account', status: 'active', itemCount: 0 },
  
  // Lisans kategorileri
  { title: 'Semrush', image: 'https://www.semrush.com/company/press-center/media/semrush-logo-square.png', type: 'license', status: 'active', itemCount: 15 },
  { title: 'WP Pro', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/WordPress_logo.svg/512px-WordPress_logo.svg.png', type: 'license', status: 'active', itemCount: 22 },
  { title: 'Canva', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Canva_icon_2021.svg/512px-Canva_icon_2021.svg.png', type: 'license', status: 'active', itemCount: 18 },
  { title: 'Windows', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Windows_logo_-_2012.svg/512px-Windows_logo_-_2012.svg.png', type: 'license', status: 'active', itemCount: 12 },
  { title: 'Adobe', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/512px-Adobe_Systems_logo_and_wordmark.svg.png', type: 'license', status: 'active', itemCount: 25 },
  { title: 'Elementor Pro', image: 'https://elementor.com/marketing/wp-content/uploads/2019/01/elementor-logo-red.png', type: 'license', status: 'active', itemCount: 14 },
  { title: 'CapCut', image: 'https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/capcut/resource/capcut_logo_494x494.png', type: 'license', status: 'active', itemCount: 16 },
  { title: 'Spotify', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png', type: 'license', status: 'active', itemCount: 0 },
  { title: 'Netflix', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/512px-Netflix_2015_logo.svg.png', type: 'license', status: 'active', itemCount: 0 }
];

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@hesapduragi.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    verified: true,
    balance: 0
  },
  {
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    password: 'user123',
    role: 'user',
    status: 'active',
    verified: true,
    balance: 150
  },
  {
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    password: 'user123',
    role: 'user',
    status: 'active',
    verified: true,
    balance: 500
  }
];

const seedAccounts = [
  {
    title: 'Counter-Strike 2 Global Elite Hesabı',
    description: 'Yüksek seviye CS2 hesabı. Global Elite rank, 2000+ saat oyun süresi, Prime hesap.',
    game: 'Counter-Strike 2',
    price: 1250,
    originalPrice: 1500,
    category: 'FPS',
    features: ['Global Elite Rank', 'Prime Hesap', '2000+ Saat', 'Temiz VAC'],
    images: [],
    level: 40,
    rank: 'Global Elite',
    rating: 4.8,
    reviews: 15,
    status: 'available'
  },
  {
    title: 'Valorant Immortal 3 Hesabı',
    description: 'Yüksek rank Valorant hesabı. Immortal 3 rank, tüm agentler açık.',
    game: 'Valorant',
    price: 850,
    originalPrice: 1000,
    category: 'FPS',
    features: ['Immortal 3 Rank', 'Tüm Agentler', 'Skinler Mevcut'],
    images: [],
    level: 120,
    rank: 'Immortal 3',
    rating: 4.6,
    reviews: 8,
    status: 'available'
  },
  {
    title: 'League of Legends Diamond Hesabı',
    description: 'Diamond rank LoL hesabı. 150+ champion, çok sayıda skin.',
    game: 'League of Legends',
    price: 650,
    originalPrice: 800,
    category: 'MOBA',
    features: ['Diamond Rank', '150+ Champion', 'Çok Sayıda Skin'],
    images: [],
    level: 180,
    rank: 'Diamond',
    rating: 4.5,
    reviews: 12,
    status: 'available'
  },
  {
    title: 'Apex Legends Predator Hesabı',
    description: 'Apex Legends Predator rank hesabı. Tüm karakterler açık.',
    game: 'Apex Legends',
    price: 950,
    originalPrice: 1200,
    category: 'Battle Royale',
    features: ['Predator Rank', 'Tüm Karakterler', 'Heirloom Mevcut'],
    images: [],
    level: 500,
    rank: 'Predator',
    rating: 4.9,
    reviews: 6,
    status: 'available'
  },
  {
    title: 'World of Warcraft Max Level Hesabı',
    description: 'WoW max level hesabı. Birden fazla karakter, iyi gear.',
    game: 'World of Warcraft',
    price: 1500,
    originalPrice: 1800,
    category: 'MMORPG',
    features: ['Max Level', 'Birden Fazla Karakter', 'İyi Gear'],
    images: [],
    level: 80,
    rank: 'Max Level',
    rating: 4.7,
    reviews: 10,
    status: 'available'
  },
  {
    title: 'Fortnite High Level Hesabı',
    description: 'Fortnite yüksek seviye hesabı. Çok sayıda skin ve emote.',
    game: 'Fortnite',
    price: 450,
    originalPrice: 600,
    category: 'Battle Royale',
    features: ['Yüksek Level', 'Çok Sayıda Skin', 'Rare Emotes'],
    images: [],
    level: 250,
    rank: 'High Level',
    rating: 4.3,
    reviews: 20,
    status: 'available'
  }
];

async function seedDatabase() {
  try {
    console.log('Veritabanına bağlanılıyor...');
    await connectDB();

    // Clear existing data
    console.log('Mevcut veriler temizleniyor...');
    await Category.deleteMany({});
    await Account.deleteMany({});
    await User.deleteMany({});

    // Seed categories
    console.log('Kategoriler ekleniyor...');
    await Category.insertMany(seedCategories);

    // Seed users - User.create kullanarak şifrelerin hash'lenmesini sağlıyoruz
    console.log('Kullanıcılar ekleniyor...');
    for (const userData of seedUsers) {
      await User.create(userData);
    }

    // Seed accounts (tek satıcı sistemi için satıcı referansı yok)
    console.log('Hesaplar ekleniyor...');
    await Account.insertMany(seedAccounts);

    console.log('✅ Veritabanı başarıyla dolduruldu!');
    console.log(`📊 ${seedCategories.length} kategori eklendi`);
    console.log(`👥 ${seedUsers.length} kullanıcı eklendi`);
    console.log(`🎮 ${seedAccounts.length} hesap eklendi`);

  } catch (error) {
    console.error('❌ Veritabanı doldurulurken hata oluştu:', error);
  } finally {
    process.exit();
  }
}

// Run the seed function
seedDatabase(); 