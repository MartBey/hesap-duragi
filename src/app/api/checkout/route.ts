import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Account from '@/models/Account';
import User from '@/models/User';

interface CheckoutItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  paymentMethod: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  paymentInfo?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardName?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const checkoutData: CheckoutData = await request.json();
    const { items, paymentMethod, customerInfo, paymentInfo } = checkoutData;

    // Temel validasyon
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Sepet boş olamaz' },
        { status: 400 }
      );
    }

    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName) {
      return NextResponse.json(
        { error: 'Müşteri bilgileri eksik' },
        { status: 400 }
      );
    }

    // Token kontrolü (opsiyonel - misafir alışveriş için)
    let buyer = null;
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        buyer = await User.findById(decoded.userId);
      } catch (error) {
        // Token geçersizse misafir olarak devam et
        console.log('Token geçersiz, misafir alışveriş olarak devam ediliyor');
      }
    }

    const createdOrders = [];
    let totalAmount = 0;

    // Her ürün için ayrı sipariş oluştur
    for (const item of items) {
      // Hesabı kontrol et
      const account = await Account.findById(item._id)
        .populate('seller', 'name email');

      if (!account) {
        return NextResponse.json(
          { error: `Hesap bulunamadı: ${item.title}` },
          { status: 404 }
        );
      }

      if (account.status !== 'available') {
        return NextResponse.json(
          { error: `Bu hesap artık satışta değil: ${item.title}` },
          { status: 400 }
        );
      }

      // Fiyat kontrolü
      if (account.price !== item.price) {
        return NextResponse.json(
          { error: `Fiyat değişmiş: ${item.title}` },
          { status: 400 }
        );
      }

      // Sipariş ID oluştur
      const orderId = `HD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Komisyon hesapla (%10)
      const commission = Math.round(account.price * 0.10);
      const sellerAmount = account.price - commission;

      // Sipariş oluştur
      const order = await Order.create({
        orderId,
        buyer: buyer ? {
          _id: buyer._id,
          name: buyer.name,
          email: buyer.email
        } : {
          _id: 'guest',
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email
        },
        seller: {
          _id: account.seller._id,
          name: account.seller.name,
          email: account.seller.email
        },
        account: {
          _id: account._id,
          title: account.title,
          game: account.game
        },
        amount: account.price,
        commission,
        status: 'pending', // Ödeme onayından sonra 'processing' olacak
        paymentStatus: 'pending',
        paymentMethod,
        notes: `Müşteri: ${customerInfo.firstName} ${customerInfo.lastName}, Tel: ${customerInfo.phone}`
      });

      // Hesap durumunu güncelle
      account.status = 'pending'; // Ödeme tamamlanınca 'sold' olacak
      await account.save();

      createdOrders.push(order);
      totalAmount += account.price;
    }

    // Ödeme işlemi simülasyonu
    // Gerçek uygulamada burada ödeme gateway'i entegrasyonu olacak
    const paymentSuccess = await simulatePayment(paymentMethod, totalAmount, paymentInfo);

    if (paymentSuccess) {
      // Ödeme başarılı - siparişleri güncelle
      for (const order of createdOrders) {
        order.status = 'processing';
        order.paymentStatus = 'paid';
        await order.save();

        // Hesabı satıldı olarak işaretle
        const account = await Account.findById(order.account._id);
        if (account) {
          account.status = 'sold';
          account.buyer = buyer?._id || 'guest';
          await account.save();
        }

        // Satıcının bakiyesini artır
        const seller = await User.findById(order.seller._id);
        if (seller) {
          const sellerAmount = order.amount - order.commission;
          seller.balance = (seller.balance || 0) + sellerAmount;
          seller.totalSales = (seller.totalSales || 0) + 1;
          await seller.save();
        }

        // Alıcının istatistiklerini güncelle (kayıtlı kullanıcı ise)
        if (buyer) {
          buyer.totalPurchases = (buyer.totalPurchases || 0) + 1;
          await buyer.save();
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Ödeme başarılı',
        data: {
          orders: createdOrders.map(order => ({
            orderId: order.orderId,
            amount: order.amount,
            account: order.account
          })),
          totalAmount,
          customerEmail: customerInfo.email
        }
      });

    } else {
      // Ödeme başarısız - siparişleri iptal et
      for (const order of createdOrders) {
        order.status = 'cancelled';
        order.paymentStatus = 'failed';
        await order.save();

        // Hesabı tekrar müsait yap
        const account = await Account.findById(order.account._id);
        if (account) {
          account.status = 'available';
          await account.save();
        }
      }

      return NextResponse.json(
        { error: 'Ödeme işlemi başarısız oldu' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 }
    );
  }
}

// Ödeme simülasyonu
async function simulatePayment(
  paymentMethod: string, 
  amount: number, 
  paymentInfo?: any
): Promise<boolean> {
  // Gerçek uygulamada burada ödeme gateway'i entegrasyonu olacak
  // Şimdilik %95 başarı oranı ile simüle ediyoruz
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekleme
  
  // Simülasyon: %95 başarı oranı
  return Math.random() > 0.05;
} 