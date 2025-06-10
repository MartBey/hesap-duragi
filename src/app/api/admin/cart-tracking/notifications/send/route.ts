import { NextRequest, NextResponse } from 'next/server';

// Mock bildirim geçmişi
const notificationHistory: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, message, type = 'cart_reminder' } = body;

    // Validasyon
    if (!userId || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Eksik parametreler' },
        { status: 400 }
      );
    }

    // Gerçek uygulamada burada:
    // 1. Email gönderimi
    // 2. Push notification
    // 3. SMS gönderimi
    // 4. In-app notification
    // yapılacak

    // Mock bildirim gönderimi (simülasyon)
    const notification = {
      id: Date.now(),
      userId,
      title,
      message,
      type,
      status: 'sent',
      sentAt: new Date(),
      deliveryMethod: ['email', 'push'], // Hangi yöntemlerle gönderildi
      readAt: null
    };

    // Geçmişe ekle
    notificationHistory.unshift(notification);

    // %10 hata simülasyonu
    if (Math.random() < 0.1) {
      throw new Error('Bildirim servisi geçici olarak kullanılamıyor');
    }

    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      data: {
        notificationId: notification.id,
        status: 'sent',
        sentAt: notification.sentAt,
        deliveryMethods: notification.deliveryMethod
      },
      message: 'Bildirim başarıyla gönderildi'
    });

  } catch (error) {
    console.error('Bildirim gönderilemedi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bildirim gönderilemedi' 
      },
      { status: 500 }
    );
  }
}

// Bildirim geçmişini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let history = [...notificationHistory];

    // Kullanıcıya göre filtrele
    if (userId) {
      history = history.filter(n => n.userId === parseInt(userId));
    }

    // Limit uygula
    history = history.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: history,
      total: history.length
    });

  } catch (error) {
    console.error('Bildirim geçmişi alınamadı:', error);
    return NextResponse.json(
      { success: false, error: 'Bildirim geçmişi alınamadı' },
      { status: 500 }
    );
  }
}