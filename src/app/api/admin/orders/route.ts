import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Account from '@/models/Account';
import { createLog } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// GET - Admin için tüm siparişleri getir
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü - önce token'daki role'ü kontrol et
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    // MongoDB'de kullanıcı varsa kontrol et, yoksa token'daki role'ü kabul et
    let user = null;
    try {
      user = await User.findById(decoded.userId);
      if (user && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Bu işlem için admin yetkisi gerekli' },
          { status: 403 }
        );
      }
    } catch (error) {
      // MongoDB'de kullanıcı bulunamazsa token'daki role'ü kabul et (fallback mode)
      console.log('Kullanıcı MongoDB\'de bulunamadı, token role\'ü kullanılıyor:', decoded.role);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    // Query oluştur
    const query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    // Arama filtresi
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'buyer.name': { $regex: search, $options: 'i' } },
        { 'buyer.email': { $regex: search, $options: 'i' } },
        { 'account.title': { $regex: search, $options: 'i' } }
      ];
    }

    // Siparişleri getir
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    // İstatistikler
    const stats = {
      total: await Order.countDocuments(),
      completed: await Order.countDocuments({ status: 'completed' }),
      processing: await Order.countDocuments({ status: 'processing' }),
      pending: await Order.countDocuments({ status: 'pending' }),
      cancelled: await Order.countDocuments({ status: 'cancelled' }),
      totalRevenue: await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      totalCommission: await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$commission' } } }
      ]).then(result => result[0]?.total || 0)
    };

    return NextResponse.json({
      success: true,
      orders,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Admin siparişler getirme hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// PUT - Sipariş durumunu güncelle
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü - önce token'daki role'ü kontrol et
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    // MongoDB'de kullanıcı varsa kontrol et, yoksa token'daki role'ü kabul et
    let user = null;
    try {
      user = await User.findById(decoded.userId);
      if (user && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Bu işlem için admin yetkisi gerekli' },
          { status: 403 }
        );
      }
    } catch (error) {
      // MongoDB'de kullanıcı bulunamazsa token'daki role'ü kabul et (fallback mode)
      console.log('Kullanıcı MongoDB\'de bulunamadı, token role\'ü kullanılıyor:', decoded.role);
    }

    const { orderId, status, notes } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Sipariş ID ve durum gerekli' },
        { status: 400 }
      );
    }

    // Sipariş durumunu güncelle
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        notes: notes || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    // Sipariş güncelleme logunu kaydet
    await createLog({
      level: 'info',
      category: 'admin',
      message: `Sipariş durumu güncellendi: ${order.orderId} -> ${status}`,
      userId: decoded.userId,
      userName: user?.name || 'Admin User',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      details: {
        orderId: order.orderId,
        oldStatus: order.status,
        newStatus: status,
        notes: notes,
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      order
    });

  } catch (error: any) {
    console.error('Sipariş güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// POST - Manuel sipariş oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü - önce token'daki role'ü kontrol et
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    // MongoDB'de kullanıcı varsa kontrol et, yoksa token'daki role'ü kabul et
    let user = null;
    try {
      user = await User.findById(decoded.userId);
      if (user && user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Bu işlem için admin yetkisi gerekli' },
          { status: 403 }
        );
      }
    } catch (error) {
      // MongoDB'de kullanıcı bulunamazsa token'daki role'ü kabul et (fallback mode)
      console.log('Kullanıcı MongoDB\'de bulunamadı, token role\'ü kullanılıyor:', decoded.role);
    }

    const { buyerId, accountId, amount, paymentMethod, status, paymentStatus, notes } = await request.json();

    // Gerekli alanları kontrol et
    if (!buyerId || !accountId || !amount) {
      return NextResponse.json(
        { error: 'Alıcı, hesap ve tutar bilgileri gerekli' },
        { status: 400 }
      );
    }

    // Alıcı kontrolü
    const buyer = await User.findById(buyerId);
    if (!buyer) {
      return NextResponse.json(
        { error: 'Alıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Hesap kontrolü
    const account = await Account.findById(accountId);
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
    
    // Sipariş numarası oluştur
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Admin kullanıcısını satıcı olarak al
    let admin = null;
    try {
      admin = await User.findById(decoded.userId);
    } catch (error) {
      console.log('Admin kullanıcısı MongoDB\'de bulunamadı, fallback data kullanılıyor');
    }

    // Fallback admin data (demo mode için)
    if (!admin) {
      admin = {
        _id: decoded.userId,
        name: 'Admin User',
        email: decoded.email || 'admin@hesapduragi.com'
      };
    }

    // Yeni sipariş oluştur
    const newOrder = new Order({
      orderId: orderNumber,
      buyer: {
        _id: buyer._id.toString(),
        name: buyer.name,
        email: buyer.email
      },
      seller: {
        _id: admin._id.toString(),
        name: admin.name,
        email: admin.email
      },
      account: {
        _id: account._id.toString(),
        title: account.title,
        game: account.game
      },
      amount: amount,
      commission: 0, // Komisyon yok - tek satıcı (admin)
      status: status || 'pending',
      paymentStatus: paymentStatus || 'pending',
      paymentMethod: paymentMethod || 'manual',
      notes: notes || 'Manuel olarak oluşturuldu'
    });

    const savedOrder = await newOrder.save();

    // Sipariş oluşturma logunu kaydet
    await createLog({
      level: 'info',
      category: 'admin',
      message: `Yeni sipariş oluşturuldu: ${orderNumber}`,
      userId: decoded.userId,
      userName: admin.name,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      details: {
        orderId: orderNumber,
        buyerEmail: buyer.email,
        accountTitle: account.title,
        amount: amount,
        paymentMethod: paymentMethod || 'manual',
        status: status || 'pending',
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu',
      order: savedOrder
    });

  } catch (error: any) {
    console.error('Manuel sipariş oluşturma hatası:', error);
    
    // Hata logunu kaydet
    await createLog({
      level: 'error',
      category: 'admin',
      message: `Sipariş oluşturma hatası: ${error.message}`,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      details: {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    });
    
    return NextResponse.json(
      { error: 'Sunucu hatası: ' + error.message },
      { status: 500 }
    );
  }
} 