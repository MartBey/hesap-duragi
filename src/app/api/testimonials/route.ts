import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Account from '@/models/Account';

const testimonialsFilePath = path.join(process.cwd(), 'data', 'testimonials.json');

// Ensure data directory exists
const dataDir = path.dirname(testimonialsFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Default testimonials data
const defaultTestimonials = [
  {
    id: 1,
    name: "Ahmet K.",
    avatar: "👨‍💼",
    rating: 5,
    comment: "PUBG Mobile hesabımı çok hızlı teslim aldım. Güvenilir ve kaliteli hizmet!",
    game: "PUBG Mobile 660 UC",
    date: "3.6.2025",
    verified: true
  },
  {
    id: 2,
    name: "Zeynep M.",
    avatar: "👩‍💻",
    rating: 5,
    comment: "Legend Online hesabı tam istediğim gibiydi. Hızlı teslimat ve güvenli ödeme.",
    game: "Legend Online 500+150 Bonus Elmas",
    date: "3.6.2025",
    verified: true
  },
  {
    id: 3,
    name: "Mehmet Y.",
    avatar: "👨‍🎮",
    rating: 5,
    comment: "Metin2 hesabını çok beğendim. Hızlı teslimat ve kaliteli hizmet için teşekkürler!",
    game: "Metin2 450 Ejder Parası",
    date: "3.6.2025",
    verified: true
  },
  {
    id: 4,
    name: "Ayşe T.",
    avatar: "👩‍🦰",
    rating: 5,
    comment: "Valorant hesabı mükemmeldi. Çok iyi haritalar ve güvenli alışveriş deneyimi.",
    game: "Valorant Premium Hesap",
    date: "3.6.2025",
    verified: true
  },
  {
    id: 5,
    name: "Can S.",
    avatar: "👨‍🚀",
    rating: 5,
    comment: "CS:GO hesabı harika! Hızlı teslimat ve müşteri hizmetleri çok başarılı.",
    game: "CS:GO Prime Hesap",
    date: "3.6.2025",
    verified: true
  }
];

function getTestimonials() {
  try {
    if (fs.existsSync(testimonialsFilePath)) {
      const data = fs.readFileSync(testimonialsFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading testimonials file:', error);
  }
  return defaultTestimonials;
}

function saveTestimonials(testimonials: any[]) {
  try {
    fs.writeFileSync(testimonialsFilePath, JSON.stringify(testimonials, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving testimonials:', error);
    return false;
  }
}

// Gerçek yorumları avatar'a dönüştürme fonksiyonu
function getRandomAvatar() {
  const avatars = ["👨‍💼", "👩‍💻", "👨‍🎮", "👩‍🦰", "👨‍🚀", "👩‍🎨", "👨‍🔬", "👩‍⚕️", "👨‍🎓", "👩‍🏫"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRealReviews = searchParams.get('includeRealReviews') === 'true';
    
    // Statik testimonials'ları al
    const staticTestimonials = getTestimonials();
    
    if (!includeRealReviews) {
      return NextResponse.json({
        success: true,
        data: staticTestimonials
      });
    }

    // Gerçek yorumları da dahil et
    try {
      await connectDB();
      
      // Son onaylanmış yorumları al (maksimum 10 adet)
      const realReviews = await Review.find({ isApproved: true })
        .populate('user', 'name')
        .populate('account', 'title category')
        .sort({ createdAt: -1 })
        .limit(10);

      // Gerçek yorumları testimonial formatına dönüştür
      const realTestimonials = realReviews.map((review: any, index: number) => ({
        id: `real_${review._id}`,
        name: review.isAnonymous ? 'Anonim Kullanıcı' : (review.user?.name || 'Müşteri'),
        avatar: getRandomAvatar(),
        rating: review.rating,
        comment: review.comment || 'Harika bir deneyim yaşadım!',
        game: review.account?.title || review.account?.category || 'Dijital Ürün',
        date: new Date(review.createdAt).toLocaleDateString('tr-TR'),
        verified: true
      }));

      // Statik ve gerçek yorumları karıştır
      const allTestimonials = [...staticTestimonials, ...realTestimonials];
      
      // Karıştır ve maksimum 15 adet döndür
      const shuffled = allTestimonials.sort(() => Math.random() - 0.5).slice(0, 15);

      return NextResponse.json({
        success: true,
        data: shuffled,
        totalCount: allTestimonials.length
      });

    } catch (dbError) {
      console.error('Database error, returning static testimonials:', dbError);
      // Veritabanı hatası durumunda sadece statik testimonials döndür
      return NextResponse.json({
        success: true,
        data: staticTestimonials,
        error: 'Gerçek yorumlar yüklenemedi, statik yorumlar gösteriliyor'
      });
    }

  } catch (error) {
    console.error('Error in testimonials API:', error);
    return NextResponse.json({
      success: false,
      error: 'Testimonials could not be loaded'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonials = getTestimonials();
    
    if (body.action === 'update') {
      // Update all testimonials
      const success = saveTestimonials(body.testimonials);
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Testimonials updated successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to save testimonials'
        }, { status: 500 });
      }
    } else if (body.action === 'add') {
      // Add new testimonial
      const newId = Math.max(...testimonials.map((t: any) => t.id), 0) + 1;
      const newTestimonial = {
        id: newId,
        name: body.name,
        avatar: body.avatar,
        rating: body.rating,
        comment: body.comment,
        game: body.game,
        date: new Date().toLocaleDateString('tr-TR'),
        verified: body.verified || false
      };
      
      testimonials.push(newTestimonial);
      const success = saveTestimonials(testimonials);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Testimonial added successfully',
          data: newTestimonial
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to save testimonial'
        }, { status: 500 });
      }
    } else if (body.action === 'delete') {
      // Delete testimonial
      const filteredTestimonials = testimonials.filter((t: any) => t.id !== body.id);
      const success = saveTestimonials(filteredTestimonials);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Testimonial deleted successfully'
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to delete testimonial'
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Error in testimonials POST:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
} 