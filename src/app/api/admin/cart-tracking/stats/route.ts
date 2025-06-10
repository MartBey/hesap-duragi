import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Gerçek uygulamada veritabanından gelecek
    const stats = {
      totalUsers: 1247,
      usersWithCart: 156,
      totalCartValue: 245670.50,
      averageCartValue: 1574.81,
      abandonedCarts: 89,
      completedOrders: 67,
      conversionRate: 42.9,
      
      // Zaman bazlı istatistikler
      timeStats: {
        last24h: {
          newCarts: 23,
          abandonedCarts: 8,
          completedOrders: 15,
          notificationsSent: 45
        },
        last7d: {
          newCarts: 167,
          abandonedCarts: 52,
          completedOrders: 115,
          notificationsSent: 298
        },
        last30d: {
          newCarts: 678,
          abandonedCarts: 234,
          completedOrders: 444,
          notificationsSent: 1156
        }
      },

      // Kategori bazlı istatistikler
      categoryStats: [
        { category: 'FPS', cartCount: 89, totalValue: 156780.50 },
        { category: 'MOBA', cartCount: 45, totalValue: 67890.25 },
        { category: 'MMORPG', cartCount: 22, totalValue: 21000.75 }
      ],

      // Oyun bazlı istatistikler
      gameStats: [
        { game: 'Valorant', cartCount: 67, totalValue: 98450.33 },
        { game: 'CS:GO', cartCount: 34, totalValue: 45670.89 },
        { game: 'League of Legends', cartCount: 28, totalValue: 34560.12 },
        { game: 'Apex Legends', cartCount: 27, totalValue: 66989.16 }
      ],

      // Bildirim istatistikleri
      notificationStats: {
        totalSent: 1156,
        deliveryRate: 98.5,
        openRate: 67.3,
        clickRate: 23.8,
        conversionRate: 12.4
      },

      // Trend verileri (son 7 gün)
      trends: {
        cartCreation: [12, 18, 15, 22, 19, 25, 23],
        cartAbandonment: [4, 6, 5, 8, 7, 9, 8],
        notifications: [25, 32, 28, 41, 35, 48, 45],
        conversions: [8, 12, 10, 14, 12, 16, 15]
      }
    };

    return NextResponse.json({
      success: true,
      data: stats,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('İstatistikler alınamadı:', error);
    return NextResponse.json(
      { success: false, error: 'İstatistikler alınamadı' },
      { status: 500 }
    );
  }
}