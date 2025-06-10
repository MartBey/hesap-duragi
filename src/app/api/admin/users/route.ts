import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// Mock users data for fallback
const mockUsers = [
  {
    _id: 'admin_123',
    name: 'Admin User',
    email: 'admin@hesapduragi.com',
    role: 'admin',
    status: 'active',
    verified: true,
    balance: 0,
    totalPurchases: 0,
    rating: 5.0,
    reviewCount: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    _id: 'demo_user_123',
    name: 'Demo Kullanıcı',
    email: 'demo@hesapduragi.com',
    role: 'user',
    status: 'active',
    verified: false,
    balance: 150,
    totalPurchases: 2,
    rating: 4.5,
    reviewCount: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'temp_1749145829065',
    name: 'Test User',
    email: 'test@test.com',
    role: 'user',
    status: 'active',
    verified: false,
    balance: 0,
    totalPurchases: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('Admin Users API çağrıldı');
    
    // JWT token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Sadece admin erişebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // MongoDB bağlantısını dene, başarısız olursa fallback
    let mongoConnected = false;
    try {
      const connectPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 2000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('MongoDB bağlantısı başarılı');
      mongoConnected = true;
    } catch (dbError) {
      console.log('MongoDB bağlantısı başarısız, fallback moda geçiliyor');
      mongoConnected = false;
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query: any = {};

    // Role filter
    if (role) {
      query.role = role;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let users: any[] = [];
    let totalCount: number = 0;
    let stats: any = {};

    if (mongoConnected) {
      // MongoDB ile normal işlem
      console.log('MongoDB bağlantısı aktif, gerçek veri çekiliyor...');
      try {
        // Get total count for pagination
        totalCount = await User.countDocuments(query);

        // Get paginated results
        users = await User.find(query)
          .select('-password') // Exclude password field
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
          
        console.log('MongoDB\'den gelen kullanıcılar:', users.map(u => ({ 
          name: u.name, 
          email: u.email, 
          phoneNumber: u.phoneNumber 
        })));

        // Get statistics
        const allUsers = await User.find({});
        stats = {
          total: allUsers.length,
          users: allUsers.filter(user => user.role === 'user').length,
          sellers: allUsers.filter(user => user.role === 'seller').length,
          admins: allUsers.filter(user => user.role === 'admin').length,
          active: allUsers.filter(user => user.status === 'active').length,
          suspended: allUsers.filter(user => user.status === 'suspended').length,
          banned: allUsers.filter(user => user.status === 'banned').length,
        };
      } catch (dbError) {
        console.log('MongoDB sorgu hatası, fallback moda geçiliyor');
        mongoConnected = false;
      }
    }

    if (!mongoConnected) {
      // Fallback - mock data kullan
      console.log('Mock user data döndürülüyor');
      let filteredUsers = [...mockUsers];

      // Apply filters
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }
      if (status) {
        filteredUsers = filteredUsers.filter(user => user.status === status);
      }
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Pagination
      totalCount = filteredUsers.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      users = filteredUsers.slice(startIndex, endIndex);

      // Statistics
      stats = {
        total: mockUsers.length,
        users: mockUsers.filter(user => user.role === 'user').length,
        sellers: mockUsers.filter(user => user.role === 'seller').length,
        admins: mockUsers.filter(user => user.role === 'admin').length,
        active: mockUsers.filter(user => user.status === 'active').length,
        suspended: mockUsers.filter(user => user.status === 'suspended').length,
        banned: mockUsers.filter(user => user.status === 'banned').length,
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        users,
        stats,
        pagination: {
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit,
        }
      }
    });

  } catch (error: any) {
    console.error('Admin Users GET Error:', error);
    
    // Hata durumunda mock data döndür
    console.log('Hata nedeniyle mock user data döndürülüyor');
    return NextResponse.json({
      success: true,
      data: {
        users: mockUsers,
        stats: {
          total: mockUsers.length,
          users: mockUsers.filter(user => user.role === 'user').length,
          sellers: mockUsers.filter(user => user.role === 'seller').length,
          admins: mockUsers.filter(user => user.role === 'admin').length,
          active: mockUsers.filter(user => user.status === 'active').length,
          suspended: mockUsers.filter(user => user.status === 'suspended').length,
          banned: mockUsers.filter(user => user.status === 'banned').length,
        },
        pagination: {
          total: mockUsers.length,
          totalPages: Math.ceil(mockUsers.length / 10),
          currentPage: 1,
          limit: 10,
        }
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Admin Users POST API çağrıldı');
    
    // JWT token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Sadece admin erişebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, email, password, role = 'user', status = 'active' } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını dene, başarısız olursa fallback
    let mongoConnected = false;
    try {
      const connectPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 2000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('MongoDB bağlantısı başarılı');
      mongoConnected = true;
    } catch (dbError) {
      console.log('MongoDB bağlantısı başarısız, fallback moda geçiliyor');
      mongoConnected = false;
    }

    if (mongoConnected) {
      // MongoDB ile normal işlem
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return NextResponse.json(
            { success: false, error: 'Bu email adresi zaten kullanılıyor' },
            { status: 400 }
          );
        }

        const newUser = new User({
          name,
          email,
          password,
          role,
          status,
          verified: false,
          balance: 0
        });

        await newUser.save();

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return NextResponse.json({
          success: true,
          data: userResponse,
          message: 'Kullanıcı başarıyla oluşturuldu'
        });
      } catch (dbError) {
        console.log('MongoDB işlemi başarısız, fallback moda geçiliyor');
        mongoConnected = false;
      }
    }

    if (!mongoConnected) {
      // Fallback - mock data ile simüle et
      console.log('Fallback modda kullanıcı oluşturuluyor');
      
      // Email kontrolü (mock data ile)
      const existingMockUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingMockUser) {
        return NextResponse.json(
          { success: false, error: 'Bu email adresi zaten kullanılıyor' },
          { status: 400 }
        );
      }

      // Yeni mock kullanıcı oluştur
      const newMockUser = {
        _id: `temp_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role,
        status,
        verified: false,
        balance: 0,
        totalPurchases: 0,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Mock users listesine ekle (geçici olarak)
      mockUsers.push(newMockUser);

      return NextResponse.json({
        success: true,
        data: newMockUser,
        message: 'Kullanıcı başarıyla oluşturuldu (Demo modu)'
      });
    }

  } catch (error) {
    console.error('Admin Users POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kullanıcı oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Admin Users PUT API çağrıldı');

    // JWT token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Sadece admin erişebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { _id, name, email, role, status, verified, balance } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını dene, başarısız olursa fallback
    let mongoConnected = false;
    try {
      const connectPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 2000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('MongoDB bağlantısı başarılı');
      mongoConnected = true;
    } catch (dbError) {
      console.log('MongoDB bağlantısı başarısız, fallback moda geçiliyor');
      mongoConnected = false;
    }

    if (mongoConnected) {
      // MongoDB ile normal işlem
      try {
        const user = await User.findById(_id);
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'Kullanıcı bulunamadı' },
            { status: 404 }
          );
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (status) user.status = status;
        if (typeof verified === 'boolean') user.verified = verified;
        if (typeof balance === 'number') user.balance = balance;

        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json({
          success: true,
          data: userResponse,
          message: 'Kullanıcı başarıyla güncellendi'
        });
      } catch (dbError) {
        console.log('MongoDB işlemi başarısız, fallback moda geçiliyor');
        mongoConnected = false;
      }
    }

    if (!mongoConnected) {
      // Fallback - mock data ile simüle et
      console.log('Fallback modda kullanıcı güncelleniyor');
      
      const userIndex = mockUsers.findIndex(u => u._id === _id);
      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      // Update mock user
      if (name) mockUsers[userIndex].name = name;
      if (email) mockUsers[userIndex].email = email;
      if (role) mockUsers[userIndex].role = role;
      if (status) mockUsers[userIndex].status = status;
      if (typeof verified === 'boolean') mockUsers[userIndex].verified = verified;
      if (typeof balance === 'number') mockUsers[userIndex].balance = balance;
      mockUsers[userIndex].updatedAt = new Date();

      return NextResponse.json({
        success: true,
        data: mockUsers[userIndex],
        message: 'Kullanıcı başarıyla güncellendi (Demo modu)'
      });
    }

  } catch (error) {
    console.error('Admin Users PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kullanıcı güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('Admin Users DELETE API çağrıldı');

    // JWT token kontrolü
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Yetkilendirme token\'ı gerekli' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-complex-123456789';
    const decoded = jwt.verify(token, jwtSecret) as any;

    // Sadece admin erişebilir
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını dene, başarısız olursa fallback
    let mongoConnected = false;
    try {
      const connectPromise = connectDB();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB bağlantı timeout')), 2000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('MongoDB bağlantısı başarılı');
      mongoConnected = true;
    } catch (dbError) {
      console.log('MongoDB bağlantısı başarısız, fallback moda geçiliyor');
      mongoConnected = false;
    }

    if (mongoConnected) {
      // MongoDB ile normal işlem
      try {
        const user = await User.findById(id);
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'Kullanıcı bulunamadı' },
            { status: 404 }
          );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({
          success: true,
          message: 'Kullanıcı başarıyla silindi'
        });
      } catch (dbError) {
        console.log('MongoDB işlemi başarısız, fallback moda geçiliyor');
        mongoConnected = false;
      }
    }

    if (!mongoConnected) {
      // Fallback - mock data ile simüle et
      console.log('Fallback modda kullanıcı siliniyor');
      
      const userIndex = mockUsers.findIndex(u => u._id === id);
      if (userIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      // Remove from mock users
      mockUsers.splice(userIndex, 1);

      return NextResponse.json({
        success: true,
        message: 'Kullanıcı başarıyla silindi (Demo modu)'
      });
    }

  } catch (error) {
    console.error('Admin Users DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Kullanıcı silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 