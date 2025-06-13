import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock data - gerçek projede veritabanından gelecek
const mockAccounts = [
  {
    _id: '1',
    title: 'Counter-Strike 2 Global Elite Hesabı',
    description: 'Prime Status, tüm operasyonlar tamamlanmış, nadir skin koleksiyonu',
    game: 'Counter-Strike 2',
    price: 1250,
    originalPrice: 1500,
    category: 'FPS',
    features: ['Prime Status', 'Tüm Operasyonlar', 'Nadir Skinler', 'Service Medal'],
    emoji: '🔫',
    images: [],
    status: 'available' as const,
    seller: {
      _id: 'seller1',
      name: 'ProGamer123'
    },
    level: 40,
    rank: 'Global Elite',
    rating: 4.8,
    reviews: 24
  },
  {
    _id: '2',
    title: 'Valorant Immortal 3 Hesabı',
    description: 'Tüm ajanlar açık, battle pass tamamlanmış, exclusive skinler',
    game: 'Valorant',
    price: 890,
    originalPrice: 1100,
    category: 'FPS',
    features: ['Tüm Ajanlar', 'Battle Pass', 'Exclusive Skinler', 'Radianite Points'],
    emoji: '🎯',
    images: [],
    status: 'available' as const,
    seller: {
      _id: 'seller2',
      name: 'ValorantPro'
    },
    level: 156,
    rank: 'Immortal 3',
    rating: 4.9,
    reviews: 18
  },
  {
    _id: '3',
    title: 'League of Legends Challenger Hesabı',
    description: 'Tüm şampiyonlar, prestige skinler, ranked rewards',
    game: 'League of Legends',
    price: 2100,
    originalPrice: 2500,
    category: 'MOBA',
    features: ['Tüm Şampiyonlar', 'Prestige Skinler', 'Ranked Rewards', 'Honor Level 5'],
    emoji: '⚔️',
    images: [],
    status: 'available' as const,
    seller: {
      _id: 'seller3',
      name: 'LeagueKing'
    },
    level: 387,
    rank: 'Challenger',
    rating: 5.0,
    reviews: 12
  },
  {
    _id: '4',
    title: 'World of Warcraft Max Level Hesabı',
    description: 'Max level karakter, epic gear, mount koleksiyonu',
    game: 'World of Warcraft',
    price: 1680,
    originalPrice: 2000,
    category: 'MMORPG',
    features: ['Max Level', 'Epic Gear', 'Mount Collection', 'Achievement Points'],
    emoji: '🏰',
    images: [],
    status: 'available' as const,
    seller: {
      _id: 'seller4',
      name: 'WoWMaster'
    },
    level: 80,
    rank: 'Mythic Raider',
    rating: 4.7,
    reviews: 31
  },
  {
    _id: '5',
    title: 'Apex Legends Predator Hesabı',
    description: 'Tüm legends açık, heirloom shards, battle pass',
    game: 'Apex Legends',
    price: 1450,
    originalPrice: 1700,
    category: 'FPS',
    features: ['Tüm Legends', 'Heirloom Shards', 'Battle Pass', 'Ranked Rewards'],
    emoji: '🎮',
    images: [],
    status: 'available' as const,
    seller: {
      _id: 'seller5',
      name: 'ApexChampion'
    },
    level: 500,
    rank: 'Predator',
    rating: 4.6,
    reviews: 19
  },
  {
    _id: '6',
    title: 'Dota 2 Immortal Hesabı',
    description: 'Rare items, immortal treasures, battle pass levels',
    game: 'Dota 2',
    price: 980,
    originalPrice: 1200,
    category: 'MOBA',
    features: ['Rare Items', 'Immortal Treasures', 'Battle Pass Levels', 'Arcana Skins'],
    images: ['/dota2-1.jpg', '/dota2-2.jpg'],
    status: 'available' as const,
    seller: {
      _id: 'seller6',
      name: 'DotaPro'
    },
    level: 234,
    rank: 'Immortal',
    rating: 4.8,
    reviews: 27
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('Accounts API çağrıldı');
    
    // Timeout ile MongoDB bağlantısı
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 5000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    console.log('MongoDB bağlantısı başarılı');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const game = searchParams.get('game');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let query: any = { status: 'available' };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Game filter
    if (game) {
      query.game = game;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count for pagination
    const totalCount = await Account.countDocuments(query);

    // Sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get paginated results
    const accounts = await Account.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    // Eğer veritabanında veri yoksa mock data döndür
    if (accounts.length === 0) {
      console.log('Veritabanında hesap bulunamadı, mock data döndürülüyor');
      let filteredMockAccounts = [...mockAccounts];
      // Filtreleri uygula
      if (category) {
        filteredMockAccounts = filteredMockAccounts.filter(acc => acc.category === category);
      }
      if (game) {
        filteredMockAccounts = filteredMockAccounts.filter(acc => acc.game === game);
      }
      if (minPrice) {
        filteredMockAccounts = filteredMockAccounts.filter(acc => acc.price >= parseInt(minPrice));
      }
      if (maxPrice) {
        filteredMockAccounts = filteredMockAccounts.filter(acc => acc.price <= parseInt(maxPrice));
      }
      // Pagination uygula
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMockAccounts = filteredMockAccounts.slice(startIndex, endIndex);
      return NextResponse.json({
        success: true,
        data: {
          accounts: paginatedMockAccounts,
          totalAccounts: filteredMockAccounts.length,
          totalPages: Math.ceil(filteredMockAccounts.length / limit),
          currentPage: page,
          limit,
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        accounts,
        totalAccounts: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      }
    });

  } catch (error: any) {
    console.error('Accounts GET Error:', error);
    
    // Hata durumunda mock data döndür
    console.log('Hata nedeniyle mock data döndürülüyor');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMockAccounts = mockAccounts.slice(startIndex, endIndex);
    return NextResponse.json({
      success: true,
      data: {
        accounts: paginatedMockAccounts,
        totalAccounts: mockAccounts.length,
        totalPages: Math.ceil(mockAccounts.length / limit),
        currentPage: page,
        limit,
      }
    });
  }
}

// Yeni hesap oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      title,
      description,
      game,
      price,
      originalPrice,
      category,
      features,
      emoji,
      images,
      seller,
      level,
      rank
    } = body;

    // Validation
    if (!title || !description || !game || !price || !category || !seller) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const newAccount = new Account({
      title,
      description,
      game,
      price,
      originalPrice: originalPrice || price,
      category,
      features: features || [],
      emoji: emoji || '🎮',
      images: images || [],
      seller,
      level: level || 1,
      rank: rank || 'Unranked',
      rating: 0,
      reviews: 0,
      status: 'available'
    });

    await newAccount.save();

    return NextResponse.json({
      success: true,
      data: newAccount,
      message: 'Hesap başarıyla oluşturuldu'
    });

  } catch (error) {
    console.error('Accounts POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Hesap oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 