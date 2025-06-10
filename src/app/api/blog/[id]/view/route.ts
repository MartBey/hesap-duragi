import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';

// Blog görüntülenme sayısını artır (POST)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Blog yazısını bul ve görüntülenme sayısını artır
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Görüntülenme sayısı güncellendi',
      data: { views: blog.views }
    });

  } catch (error) {
    console.error('Görüntülenme sayısı güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Görüntülenme sayısı güncellenemedi' },
      { status: 500 }
    );
  }
} 