import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// Alt kategorileri getir
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
      data: category.subcategories || []
    });

  } catch (error) {
    console.error('Alt kategoriler getirme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Alt kategoriler getirilemedi' },
      { status: 500 }
    );
  }
}

// Alt kategori ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Alt kategori adı gereklidir' },
        { status: 400 }
      );
    }

    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Alt kategori zaten var mı kontrol et
    const existingSubcategory = category.subcategories.find(
      (sub: any) => sub.slug === slug
    );

    if (existingSubcategory) {
      return NextResponse.json(
        { success: false, message: 'Bu alt kategori zaten mevcut' },
        { status: 400 }
      );
    }

    // Yeni alt kategori ekle
    const newSubcategory = {
      name,
      slug,
      description: description || '',
      isActive: true,
      order: category.subcategories.length + 1
    };

    category.subcategories.push(newSubcategory);
    await category.save();

    return NextResponse.json({
      success: true,
      data: newSubcategory,
      message: 'Alt kategori başarıyla eklendi'
    });

  } catch (error) {
    console.error('Alt kategori ekleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Alt kategori eklenemedi' },
      { status: 500 }
    );
  }
}

// Alt kategori güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { subcategoryId, name, description, isActive } = body;

    if (!subcategoryId || !name) {
      return NextResponse.json(
        { success: false, message: 'Alt kategori ID ve adı gereklidir' },
        { status: 400 }
      );
    }

    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Alt kategoriyi bul
    const subcategoryIndex = category.subcategories.findIndex(
      (sub: any) => sub._id.toString() === subcategoryId
    );

    if (subcategoryIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Alt kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Alt kategoriyi güncelle
    category.subcategories[subcategoryIndex] = {
      ...category.subcategories[subcategoryIndex],
      name,
      slug,
      description: description || '',
      isActive: isActive !== undefined ? isActive : true
    };

    await category.save();

    return NextResponse.json({
      success: true,
      data: category.subcategories[subcategoryIndex],
      message: 'Alt kategori başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Alt kategori güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Alt kategori güncellenemedi' },
      { status: 500 }
    );
  }
}

// Alt kategori sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const subcategoryId = searchParams.get('subcategoryId');

    if (!subcategoryId) {
      return NextResponse.json(
        { success: false, message: 'Alt kategori ID gereklidir' },
        { status: 400 }
      );
    }

    const category = await Category.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    // Alt kategoriyi sil
    category.subcategories = category.subcategories.filter(
      (sub: any) => sub._id.toString() !== subcategoryId
    );

    await category.save();

    return NextResponse.json({
      success: true,
      message: 'Alt kategori başarıyla silindi'
    });

  } catch (error) {
    console.error('Alt kategori silme hatası:', error);
    return NextResponse.json(
      { success: false, message: 'Alt kategori silinemedi' },
      { status: 500 }
    );
  }
} 