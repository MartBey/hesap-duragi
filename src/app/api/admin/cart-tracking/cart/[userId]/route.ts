import { NextRequest, NextResponse } from 'next/server';

// Dinamik mock sepet verileri - kullanıcı ID'sine göre değişir
function generateDynamicCart(userId: number) {
  const timeBasedSeed = Math.floor(Date.now() / 30000) + userId; // 30 saniyede bir değişir
  const random = Math.sin(timeBasedSeed) * 10000;
  const normalizedRandom = Math.abs(random - Math.floor(random));
  
  const products = [
    { 
      productId: 1, 
      name: 'Valorant Immortal Hesap', 
      price: 1299.99, 
      category: 'FPS',
      game: 'Valorant',
      image: '/images/valorant.jpg',
      rank: 'Immortal 2',
      level: 150
    },
    { 
      productId: 2, 
      name: 'CS:GO Global Elite', 
      price: 899.99, 
      category: 'FPS',
      game: 'CS:GO',
      image: '/images/csgo.jpg',
      rank: 'Global Elite',
      level: 40
    },
    { 
      productId: 3, 
      name: 'LoL Diamond Hesap', 
      price: 599.99, 
      category: 'MOBA',
      game: 'League of Legends',
      image: '/images/lol.jpg',
      rank: 'Diamond 3',
      level: 87
    },
    { 
      productId: 4, 
      name: 'Apex Legends Predator', 
      price: 1599.99, 
      category: 'FPS',
      game: 'Apex Legends',
      image: '/images/apex.jpg',
      rank: 'Predator',
      level: 500
    },
    { 
      productId: 5, 
      name: 'Overwatch Grandmaster', 
      price: 799.99, 
      category: 'FPS',
      game: 'Overwatch',
      image: '/images/overwatch.jpg',
      rank: 'Grandmaster',
      level: 250
    }
  ];

  // Kullanıcıya göre dinamik sepet oluştur
  const cartItems = [];
  const itemCount = Math.floor(normalizedRandom * 4) + 1; // 1-4 ürün
  
  for (let i = 0; i < itemCount; i++) {
    const productIndex = Math.floor((normalizedRandom * (i + 1) * 100) % products.length);
    const product = products[productIndex];
    
    cartItems.push({
      ...product,
      quantity: 1,
      addedAt: new Date(Date.now() - (normalizedRandom * 86400000 * (i + 1))), // Son 1-4 gün içinde
    });
  }
  
  return cartItems;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz kullanıcı ID' },
        { status: 400 }
      );
    }

    // Dinamik sepet verileri oluştur
    const cartItems = generateDynamicCart(userId);
    
    // Sepet istatistikleri
    const stats = {
      totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      oldestItem: cartItems.length > 0 
        ? Math.min(...cartItems.map(item => item.addedAt.getTime()))
        : null,
      categories: [...new Set(cartItems.map(item => item.category))],
      games: [...new Set(cartItems.map(item => item.game))]
    };

    return NextResponse.json({
      success: true,
      data: {
        userId,
        items: cartItems,
        stats
      },
      timestamp: new Date().toISOString() // Anlık veri kontrolü için
    });

  } catch (error) {
    console.error('Sepet verileri alınamadı:', error);
    return NextResponse.json(
      { success: false, error: 'Sepet verileri alınamadı' },
      { status: 500 }
    );
  }
}

// Sepetten ürün kaldırma - dinamik veri için simülasyon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId);
    const { searchParams } = new URL(request.url);
    const productId = parseInt(searchParams.get('productId') || '0');
    
    if (isNaN(userId) || isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz parametreler' },
        { status: 400 }
      );
    }

    // Gerçek uygulamada burada veritabanından silme işlemi yapılacak
    // Şimdilik başarılı yanıt döndürüyoruz
    
    return NextResponse.json({
      success: true,
      message: 'Ürün sepetten kaldırıldı',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Ürün kaldırılamadı:', error);
    return NextResponse.json(
      { success: false, error: 'Ürün kaldırılamadı' },
      { status: 500 }
    );
      }
  } 