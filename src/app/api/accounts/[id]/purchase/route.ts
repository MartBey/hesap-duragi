import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';
import User from '@/models/User';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Hesabı bul
    const account = await Account.findById(params.id);

    if (!account) {
      return NextResponse.json(
        { error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    // Hesap müsait mi kontrol et
    if (account.status !== 'available') {
      return NextResponse.json(
        { error: 'Bu hesap artık satışta değil' },
        { status: 400 }
      );
    }

    // Stok kontrolü
    if (account.stock <= 0) {
      return NextResponse.json(
        { error: 'Bu hesap stokta yok' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const buyer = await User.findById(decoded.userId);
    if (!buyer) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Admin kullanıcısını seller olarak kabul et
    const adminSeller = await User.findOne({ role: 'admin' });
    if (!adminSeller) {
      return NextResponse.json(
        { error: 'Satıcı bulunamadı' },
        { status: 500 }
      );
    }

    // Bakiye kontrolü
    if (buyer.balance < account.price) {
      return NextResponse.json(
        { error: 'Yetersiz bakiye' },
        { status: 400 }
      );
    }

    // Sipariş ID oluştur
    const orderId = `HD${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Sipariş oluştur
    const order = await Order.create({
      orderId,
      buyer: buyer._id,
      seller: adminSeller._id,
      account: account._id,
      amount: account.price,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'balance',
    });

    // Stok azalt
    account.stock -= 1;
    
    // Stok bittiğinde hesap durumunu güncelle
    if (account.stock <= 0) {
      account.status = 'sold';
    }
    
    await account.save();

    // Alıcının bakiyesini düş
    buyer.balance -= account.price;
    buyer.totalPurchases = (buyer.totalPurchases || 0) + 1;
    await buyer.save();

    // Satıcının bakiyesini artır ve satış sayısını güncelle
    adminSeller.balance = (adminSeller.balance || 0) + account.price;
    adminSeller.totalSales = (adminSeller.totalSales || 0) + 1;
    await adminSeller.save();

    console.log('Satın alma işlemi tamamlandı:', {
      orderId: order.orderId,
      buyer: buyer.name,
      seller: adminSeller.name,
      account: account.title,
      amount: account.price
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Satın alma işlemi başarılı',
        data: {
          orderId: order.orderId,
          account: {
            title: account.title,
            game: account.game,
            price: account.price,
          },
          seller: {
            name: adminSeller.name,
            email: adminSeller.email,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Purchase API Error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.' },
      { status: 500 }
    );
  }
} 