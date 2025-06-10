import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';

// Blog yazılarını listeleme (GET)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // Query oluştur
    let query: any = {};
    
    // Status filtresi
    if (status !== 'all') {
      query.status = status;
    }
    
    // Kategori filtresi
    if (category) {
      query.category = category;
    }
    
    // Arama filtresi
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Toplam sayı
    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Blog yazılarını getir
    const blogs = await Blog.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Blog listesi getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Blog yazıları getirilemedi' },
      { status: 500 }
    );
  }
}

// Yeni blog yazısı oluşturma (POST)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Token kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz token' },
        { status: 401 }
      );
    }

    // Admin kontrolü
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Bu işlem için admin yetkisi gerekli' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Slug kontrolü
    if (body.slug) {
      const existingBlog = await Blog.findOne({ slug: body.slug });
      if (existingBlog) {
        return NextResponse.json(
          { success: false, message: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    // Yeni blog yazısı oluştur
    const newBlog = new Blog({
      ...body,
      createdBy: decoded.userId
    });

    await newBlog.save();

    // Populate edilmiş veriyi getir
    const populatedBlog = await Blog.findById(newBlog._id)
      .populate('createdBy', 'name email')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Blog yazısı başarıyla oluşturuldu',
      data: populatedBlog
    });

  } catch (error: any) {
    console.error('Blog oluşturma hatası:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Blog yazısı oluşturulamadı' },
      { status: 500 }
    );
  }
} 