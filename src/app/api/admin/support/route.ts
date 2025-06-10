import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Support from '@/models/Support';
import User from '@/models/User';

// GET - Admin için tüm destek biletlerini getir
export async function GET(request: NextRequest) {
  try {
    console.log('Admin support API çağrıldı');
    await connectDB();

    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Mevcut' : 'Yok');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authorization header eksik veya yanlış format');
      return NextResponse.json(
        { error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;
    console.log('Decoded token:', { userId: decoded.userId, role: decoded.role });

    // Sadece admin erişebilir
    if (decoded.role !== 'admin') {
      console.log('Kullanıcı admin değil:', decoded.role);
      return NextResponse.json(
        { error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');

    // Query oluştur
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    // Destek biletlerini getir
    const tickets = await Support.find(query)
      .populate('userId', 'name email')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(); // lean() ekleyerek performansı artırıyoruz

    const total = await Support.countDocuments(query);

    // İstatistikler
    const stats = await Support.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Support.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Tickets'ı frontend'in beklediği formata dönüştür
    const formattedTickets = tickets.map(ticket => ({
      _id: ticket._id,
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      user: {
        _id: ticket.userId?._id || ticket.userId,
        name: ticket.userId?.name || ticket.userName,
        email: ticket.userId?.email || ticket.userEmail
      },
      assignedTo: ticket.adminId ? {
        _id: ticket.adminId._id,
        name: ticket.adminId.name
      } : undefined,
      responses: [], // Bu kısım ayrı bir endpoint'te handle edilecek
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt
    }));

    console.log(`Admin support API: ${formattedTickets.length} ticket bulundu`);

    return NextResponse.json({
      success: true,
      tickets: formattedTickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        byStatus: stats,
        byPriority: priorityStats,
        total
      }
    });

  } catch (error: any) {
    console.error('Admin destek biletleri getirme hatası:', error);
    
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