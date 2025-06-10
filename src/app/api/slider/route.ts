import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'slider.json');

const dataDir = path.dirname(dataFilePath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const defaultSliderData = [
  {
    id: 1,
    title: "OYUN HESAPLARI",
    subtitle: "Güvenli Alışveriş",
    description: "FPS, MMORPG, MOBA oyunları için güvenilir hesap platformu",
    buttonText: "Keşfet",
    link: "/products",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundImage: "",
    icons: [
      { type: "gamepad", x: 15, y: 20, rotation: -15 },
      { type: "trophy", x: 85, y: 15, rotation: 25 },
      { type: "star", x: 20, y: 75, rotation: 45 },
      { type: "diamond", x: 80, y: 80, rotation: -30 },
      { type: "crown", x: 50, y: 25, rotation: 15 }
    ]
  },
  {
    id: 2,
    title: "HIZLI TESLİMAT",
    subtitle: "24 Saat Garanti",
    description: "Siparişiniz 24 saat içinde güvenle teslim edilir",
    buttonText: "Sipariş Ver",
    link: "/products",
    backgroundColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    backgroundImage: "",
    icons: [
      { type: "clock", x: 20, y: 30, rotation: 0 },
      { type: "shield", x: 75, y: 20, rotation: -20 },
      { type: "delivery", x: 25, y: 70, rotation: 30 },
      { type: "check", x: 80, y: 75, rotation: 15 },
      { type: "lightning", x: 50, y: 50, rotation: -45 }
    ]
  },
  {
    id: 3,
    title: "GÜVENLİ ÖDEME",
    subtitle: "Bakiye Sistemi",
    description: "Güvenli bakiye yükleme ve ödeme sistemi ile kolay alışveriş",
    buttonText: "Bakiye Yükle",
    link: "/balance",
    backgroundColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    backgroundImage: "",
    icons: [
      { type: "wallet", x: 18, y: 25, rotation: 10 },
      { type: "card", x: 82, y: 18, rotation: -25 },
      { type: "lock", x: 15, y: 78, rotation: 35 },
      { type: "money", x: 85, y: 82, rotation: -15 },
      { type: "secure", x: 50, y: 35, rotation: 20 }
    ]
  }
];

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify(defaultSliderData, null, 2));
}

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const sliderData = JSON.parse(data);
    return NextResponse.json(sliderData);
  } catch (error) {
    console.error('Error reading slider data:', error);
    return NextResponse.json(defaultSliderData);
  }
}

export async function POST(request: NextRequest) {
  try {
    const sliderData = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(sliderData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving slider data:', error);
    return NextResponse.json({ success: false, error: 'Failed to save slider data' }, { status: 500 });
  }
} 