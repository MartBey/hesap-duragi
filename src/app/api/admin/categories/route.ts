import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

// Interface kaldırıldı - Category model'den gelecek

// Varsayılan kategorileri oluştur
const createDefaultCategories = async () => {
  const defaultCategories = [
    // Hesap kategorileri
    { title: 'Instagram', image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'Gmail', image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'Twitter', image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'Facebook', image: 'https://images.unsplash.com/photo-1633675254053-d96c7668c3b8?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'TikTok', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'YouTube', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'LinkedIn', image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    { title: 'Discord', image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop', type: 'account', status: 'active' },
    
    // Lisans kategorileri
    { title: 'Canva', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop', type: 'license', status: 'active' },
    { title: 'Adobe', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=100&h=100&fit=crop', type: 'license', status: 'active' },
    { title: 'Spotify', image: 'https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=100&h=100&fit=crop', type: 'license', status: 'active' },
    { title: 'Netflix', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop', type: 'license', status: 'active' },
  ];

  for (const categoryData of defaultCategories) {
    const existingCategory = await Category.findOne({ 
      title: categoryData.title, 
      type: categoryData.type 
    });
    
    if (!existingCategory) {
      await Category.create(categoryData);
    }
  }
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Varsayılan kategorileri oluştur (eğer yoksa)
    await createDefaultCategories();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type'); // 'account' | 'license'
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query: any = {};

    // Type filter
    if (type) {
      query.type = type;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await Category.countDocuments(query);

    // Get paginated results
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get statistics
    const allCategories = await Category.find({});
    const stats = {
      total: totalCount,
      accounts: allCategories.filter(cat => cat.type === 'account').length,
      licenses: allCategories.filter(cat => cat.type === 'license').length,
      active: allCategories.filter(cat => cat.status === 'active').length,
      inactive: allCategories.filter(cat => cat.status === 'inactive').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        categories,
        stats,
        pagination: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit,
        }
      }
    });

  } catch (error) {
    console.error('Admin Categories GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategoriler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/categories - Starting...');
    await connectDB();
    console.log('Database connected successfully');
    
    const body = await request.json();
    console.log('Request body:', body);
    const { title, image, type, status = 'active' } = body;

    if (!title || !type) {
      console.log('Validation failed: Missing title or type');
      return NextResponse.json(
        { success: false, error: 'Başlık ve tip gereklidir' },
        { status: 400 }
      );
    }

    if (!image) {
      console.log('Validation failed: Missing image');
      return NextResponse.json(
        { success: false, error: 'Fotoğraf URL\'si gereklidir' },
        { status: 400 }
      );
    }

    // Check if category already exists
    console.log('Checking for existing category...');
    const existingCategory = await Category.findOne({ title, type });
    if (existingCategory) {
      console.log('Category already exists:', existingCategory);
      return NextResponse.json(
        { success: false, error: 'Bu kategori zaten mevcut' },
        { status: 400 }
      );
    }

    console.log('Creating new category...');
    const newCategory = new Category({
      title,
      image,
      type,
      status,
      itemCount: 0
    });

    console.log('Saving category to database...');
    await newCategory.save();
    console.log('Category saved successfully:', newCategory);

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Kategori başarıyla oluşturuldu'
    });

  } catch (error) {
    console.error('Admin Categories POST Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error('Error details:', {
      message: errorMessage,
      error: error
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Kategori oluşturulurken hata oluştu',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { _id, title, image, type, status } = body;

    if (!_id || !title || !type) {
      return NextResponse.json(
        { success: false, error: 'ID, başlık ve tip gereklidir' },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Fotoğraf URL\'si gereklidir' },
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        title,
        image,
        type,
        status
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Kategori başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Admin Categories PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}



export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Kategori ID gerekli' },
        { status: 400 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla silindi'
    });

  } catch (error) {
    console.error('Admin Categories DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 