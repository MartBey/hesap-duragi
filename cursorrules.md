# 🎮 HesapDuragı - Oyun Hesabı Satın Alma Platformu

## 📌 Genel Bilgiler
Next.js tabanlı modern oyun hesabı satılan bir websitesi. Kullanıcı dostu arayüz ve güvenli altyapı ile oyun hesap alışverişi.

**Renk Paleti:**
- Primary: `#ff6600` (Turuncu)
- Secondary: `#000000` (Siyah)
- Text: `#ffffff` (Beyaz)
- Accent: `#ff8c42` (Açık Turuncu)

## 🛠 Teknolojik Altyapı
- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** RESTful API
- **Veritabanı:** MongoDB
- **Kimlik Doğrulama:** NextAuth.js + SMTPD
- **Form Yönetimi:** React Hook Form + Zod

## 👥 Kullanıcı Rolleri

### 🛡️ Admin
- Kullanıcı CRUD işlemleri
- Ürün moderasyonu
- Kategori yönetimi
- İndirim oluşturma
- Sistem ayarları

### 🧑‍💻 Müşteri
- Ürün satın alma
- Bakiye yükleme
- Sipariş geçmişi
- Profil yönetimi
- Favori ürünler
- Yorum yapma

## 📜 Platform Kuralları
1. Tüm işlemler platform üzerinden yapılmalı
2. Gmail doğrulaması zorunlu
4. Ürün bilgileri eksiksiz girilmeli
5. Bakiye sistemi dışında ödeme kabul edilmez 
6. 24 saat içinde hesap teslimi

## 🔄 İşlem Akışı
1. Satıcı hesap bilgilerini girer
2. Admin onay süreci
3. Alıcı bakiye yükler
4. Satın alma işlemi
5. Bilgi transferi
6. İşlem kaydı

## 🗃️ Ürün Yapısı
```json
{
  "id": "string",
  "title": "string",
  "price": "number",
  "category": ["FPS","MMORPG","MOBA"],
  "details": {
    "level": "number",
    "rank": "string"
  }
}