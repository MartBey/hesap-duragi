import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// Kategori detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Kategori detay getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Kategori detayı getirilemedi' },
      { status: 500 }
    );
  }
} 