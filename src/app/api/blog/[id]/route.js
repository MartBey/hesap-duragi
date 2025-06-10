import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Blog yazısı detayını getirme (GET)
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // ID veya slug ile arama
    let blog;
    if (mongoose.Types.ObjectId.isValid(id)) {
      blog = await Blog.findById(id)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .lean();
    } else {
      blog = await Blog.findOne({ slug: id })
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .lean();
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Görüntülenme sayısını artır (sadece published yazılar için)
    if (blog.status === 'published') {
      await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
      blog.views += 1;
    }

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Blog detay getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Blog yazısı getirilemedi' },
      { status: 500 }
    );
  }
}

// Blog yazısını güncelleme (PUT)
export async function PUT(request, { params }) {
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

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
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

    const { id } = params;
    const body = await request.json();

    // Blog yazısını bul
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Slug kontrolü (eğer değiştiriliyorsa)
    if (body.slug && body.slug !== existingBlog.slug) {
      const slugExists = await Blog.findOne({ slug: body.slug, _id: { $ne: id } });
      if (slugExists) {
        return NextResponse.json(
          { success: false, message: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    // Güncelleme verilerini hazırla
    const updateData = {
      ...body,
      updatedBy: decoded.userId
    };

    // Status değişikliği kontrolü
    if (body.status === 'published' && existingBlog.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    // Blog yazısını güncelle
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Blog yazısı başarıyla güncellendi',
      data: updatedBlog
    });

  } catch (error) {
    console.error('Blog güncelleme hatası:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Blog yazısı güncellenemedi' },
      { status: 500 }
    );
  }
}

// Blog yazısını silme (DELETE)
export async function DELETE(request, { params }) {
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

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
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

    const { id } = params;

    // Blog yazısını bul ve sil
    const deletedBlog = await Blog.findByIdAndDelete(id);
    
    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog yazısı başarıyla silindi'
    });

  } catch (error) {
    console.error('Blog silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Blog yazısı silinemedi' },
      { status: 500 }
    );
  }
} 