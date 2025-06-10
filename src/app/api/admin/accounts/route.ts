import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

export const dynamic = 'force-dynamic';

// GET - Hesapları listele
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const game = searchParams.get('game') || 'all';

    // MongoDB query oluştur
    let query: any = {};
    
    // Arama filtresi
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { game: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Kategori filtresi
    if (category !== 'all') {
      query.category = category;
    }
    
    // Durum filtresi
    if (status !== 'all') {
      query.status = status;
    }
    
    // Oyun filtresi
    if (game !== 'all') {
      query.game = game;
    }

    // Toplam sayı
    const totalAccounts = await Account.countDocuments(query);
    
    // Sayfalama ile hesapları getir
    const accounts = await Account.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // İstatistikler
    const allAccounts = await Account.find({}).lean();
    const stats = {
      total: allAccounts.length,
      available: allAccounts.filter(a => a.status === 'available').length,
      sold: allAccounts.filter(a => a.status === 'sold').length,
      pending: allAccounts.filter(a => a.status === 'pending').length,
      suspended: allAccounts.filter(a => a.status === 'suspended').length,
      totalValue: allAccounts.reduce((sum, account) => sum + account.price, 0),
      avgPrice: allAccounts.length > 0 ? allAccounts.reduce((sum, account) => sum + account.price, 0) / allAccounts.length : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        accounts: accounts.map((account: any) => ({
          ...account,
          _id: account._id.toString(),
          isWeeklyDeal: account.isWeeklyDeal || false,
          seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalAccounts / limit),
          totalAccounts,
          hasNext: page * limit < totalAccounts,
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Hesaplar yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Yeni hesap oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      title, 
      game, 
      price, 
      originalPrice, 
      category,
      subcategory, 
      level, 
      rank, 
      description, 
      features, 
      emoji,
      images,
      stock,
      discountPercentage,
      isOnSale,
      isFeatured
    } = body;

    // Validasyon
    if (!title || !game || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Zorunlu alanlar eksik' },
        { status: 400 }
      );
    }

    // Yeni hesap oluştur
    const newAccount = new Account({
      title,
      game,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      category,
      subcategory: subcategory || '',
      level: level || '1',
      rank: rank || 'Unranked',
      description: description || '',
      features: features || [],
      emoji: emoji || '🎮',
      images: images || [],
      stock: stock ? parseInt(stock) : 1,
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : 0,
      isOnSale: isOnSale || false,
      isFeatured: isFeatured || false
    });

    const savedAccount = await newAccount.save();

    return NextResponse.json({
      success: true,
      message: 'Hesap başarıyla oluşturuldu',
      data: {
        ...savedAccount.toObject(),
        _id: savedAccount._id.toString(),
        seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
      }
    });

  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { success: false, error: 'Hesap oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT - Hesap güncelle
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { accountId, updates } = body;

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Hesap ID gerekli' },
        { status: 400 }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      return NextResponse.json(
        { success: false, error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hesap başarıyla güncellendi',
      data: {
        ...updatedAccount.toObject(),
        _id: updatedAccount._id.toString(),
        seller: { _id: 'admin', name: 'Admin', email: 'admin@example.com' }
      }
    });

  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { success: false, error: 'Hesap güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Hesap sil
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { success: false, error: 'Hesap ID gerekli' },
        { status: 400 }
      );
    }

    const deletedAccount = await Account.findByIdAndDelete(accountId);

    if (!deletedAccount) {
      return NextResponse.json(
        { success: false, error: 'Hesap bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Hesap başarıyla silindi',
      data: {
        ...deletedAccount.toObject(),
        _id: deletedAccount._id.toString()
      }
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { success: false, error: 'Hesap silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 