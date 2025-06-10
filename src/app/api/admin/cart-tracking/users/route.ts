import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Dinamik mock sepet verileri - her çağrıda değişir
function generateDynamicCartData(users: any[]) {
  const cartData: { [key: string]: { itemCount: number; value: number } } = {};
  
  users.forEach((user: any, index) => {
    // Zaman bazlı rastgelelik - her dakika farklı sonuç
    const timeBasedSeed = Math.floor(Date.now() / 60000) + index;
    const random = Math.sin(timeBasedSeed) * 10000;
    const normalizedRandom = (random - Math.floor(random));
    
    if (normalizedRandom > 0.4) { // %60 kullanıcının sepeti var
      cartData[user._id.toString()] = {
        itemCount: Math.floor(Math.abs(normalizedRandom * 10)) % 5 + 1,
        value: Math.floor(Math.abs(normalizedRandom * 5000)) + 200
      };
    }
  });
  
  return cartData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const hasCart = searchParams.get('hasCart');
    const sortBy = searchParams.get('sortBy') || 'lastActivity';
    const order = searchParams.get('order') || 'desc';

    // Gerçek kullanıcıları getir
    const users = await User.find({}).lean();

    // Dinamik sepet verileri oluştur
    const mockCartData = generateDynamicCartData(users);

    // Kullanıcı verilerini sepet bilgileriyle birleştir
    const usersWithCartInfo = users.map((user: any) => {
      const cartData = mockCartData[user._id.toString()] || { itemCount: 0, value: 0 };
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'Belirtilmemiş',
        lastActivity: user.lastLogin || user.createdAt,
        cartItemCount: cartData.itemCount,
        cartValue: cartData.value,
        registeredAt: user.createdAt
      };
    });

    // Sepeti olan kullanıcıları filtrele
    let filteredUsers = usersWithCartInfo;
    if (hasCart === 'true') {
      filteredUsers = usersWithCartInfo.filter(user => user.cartItemCount > 0);
    }

    // Sıralama
    filteredUsers.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'cartValue':
          aValue = a.cartValue;
          bValue = b.cartValue;
          break;
        case 'cartItemCount':
          aValue = a.cartItemCount;
          bValue = b.cartItemCount;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          aValue = new Date(a.lastActivity).getTime();
          bValue = new Date(b.lastActivity).getTime();
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
      timestamp: new Date().toISOString() // Anlık veri kontrolü için
    });

  } catch (error) {
    console.error('Kullanıcılar alınamadı:', error);
    return NextResponse.json(
      { success: false, error: 'Kullanıcılar alınamadı' },
      { status: 500 }
    );
      }
  } 