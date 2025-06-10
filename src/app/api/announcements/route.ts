import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ANNOUNCEMENTS_FILE = path.join(process.cwd(), 'data', 'announcements.json');

// Varsayılan duyurular
const DEFAULT_ANNOUNCEMENTS = [
  "🔥 Yeni Valorant hesapları stoklarda!",
  "💫 CS:GO Prime hesaplarında %20 indirim!",
  "🎮 League of Legends Elmas hesapları geldi!",
  "🌟 7/24 Canlı Destek hizmetimiz aktif!",
];

// Dosya yoksa oluştur
async function ensureAnnouncementsFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      await fs.access(ANNOUNCEMENTS_FILE);
    } catch {
      await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(DEFAULT_ANNOUNCEMENTS, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring announcements file:', error);
  }
}

// GET - Duyuruları getir
export async function GET() {
  try {
    await ensureAnnouncementsFile();
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8');
    const announcements = JSON.parse(data);
    
    return NextResponse.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Error reading announcements:', error);
    return NextResponse.json({
      success: true,
      data: DEFAULT_ANNOUNCEMENTS
    });
  }
}

// POST - Duyuruları güncelle
export async function POST(request: NextRequest) {
  try {
    const { announcements } = await request.json();
    
    if (!Array.isArray(announcements)) {
      return NextResponse.json({
        success: false,
        error: 'Duyurular array formatında olmalıdır'
      }, { status: 400 });
    }

    // Boş duyuruları filtrele
    const filteredAnnouncements = announcements.filter(
      (announcement: string) => announcement && announcement.trim().length > 0
    );

    if (filteredAnnouncements.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'En az bir duyuru gereklidir'
      }, { status: 400 });
    }

    await ensureAnnouncementsFile();
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(filteredAnnouncements, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Duyurular başarıyla güncellendi',
      data: filteredAnnouncements
    });
  } catch (error) {
    console.error('Error updating announcements:', error);
    return NextResponse.json({
      success: false,
      error: 'Duyurular güncellenirken bir hata oluştu'
    }, { status: 500 });
  }
} 