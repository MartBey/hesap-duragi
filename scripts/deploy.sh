#!/bin/bash

# HesapDurağı Deployment Script
echo "🚀 HesapDurağı Deployment Başlıyor..."

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata durumunda çık
set -e

# Değişkenler
PROJECT_NAME="hesapduragi"
DOMAIN="your-domain.com"  # Buraya kendi domain'inizi yazın
EMAIL="your-email@domain.com"  # Let's Encrypt için

echo -e "${YELLOW}📋 Sistem gereksinimleri kontrol ediliyor...${NC}"

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker yüklü değil! Lütfen Docker'ı yükleyin.${NC}"
    exit 1
fi

# Docker Compose kontrolü
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose yüklü değil! Lütfen Docker Compose'u yükleyin.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Sistem gereksinimleri tamam${NC}"

# Environment dosyası kontrolü
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}⚠️  .env.production dosyası bulunamadı. Örnek dosya oluşturuluyor...${NC}"
    cat > .env.production << EOF
NODE_ENV=production
MONGODB_URI=mongodb://admin:change-this-password@mongo:27017/hesapduragi?authSource=admin
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://$DOMAIN
JWT_SECRET=$(openssl rand -base64 32)
APP_URL=https://$DOMAIN
API_URL=https://$DOMAIN/api
BCRYPT_ROUNDS=12
EOF
    echo -e "${YELLOW}📝 Lütfen .env.production dosyasını düzenleyin ve şifreleri değiştirin!${NC}"
    read -p "Devam etmek için Enter'a basın..."
fi

# SSL sertifika klasörü oluştur
mkdir -p nginx/ssl

# Nginx konfigürasyonunda domain'i güncelle
echo -e "${YELLOW}🔧 Nginx konfigürasyonu güncelleniyor...${NC}"
sed -i "s/your-domain.com/$DOMAIN/g" nginx/nginx.conf

# Docker build
echo -e "${YELLOW}🔨 Docker image build ediliyor...${NC}"
docker-compose build --no-cache

# Eski container'ları durdur
echo -e "${YELLOW}🛑 Eski container'lar durduruluyor...${NC}"
docker-compose down

# Yeni container'ları başlat
echo -e "${YELLOW}🚀 Yeni container'lar başlatılıyor...${NC}"
docker-compose up -d

# Container durumlarını kontrol et
echo -e "${YELLOW}📊 Container durumları kontrol ediliyor...${NC}"
sleep 10
docker-compose ps

# Sağlık kontrolü
echo -e "${YELLOW}🏥 Sağlık kontrolü yapılıyor...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Uygulama başarıyla çalışıyor!${NC}"
        break
    fi
    echo "Bekleniyor... ($i/30)"
    sleep 2
done

# Let's Encrypt sertifikası (isteğe bağlı)
read -p "Let's Encrypt SSL sertifikası kurmak istiyor musunuz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔒 Let's Encrypt sertifikası kuruluyor...${NC}"
    
    # Certbot container'ı çalıştır
    docker run -it --rm \
        -v $(pwd)/nginx/ssl:/etc/letsencrypt \
        -v $(pwd)/nginx/ssl:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN -d www.$DOMAIN
    
    # Nginx'i yeniden başlat
    docker-compose restart nginx
    
    echo -e "${GREEN}✅ SSL sertifikası kuruldu!${NC}"
fi

echo -e "${GREEN}🎉 Deployment tamamlandı!${NC}"
echo -e "${GREEN}🌐 Siteniz şu adreste çalışıyor: https://$DOMAIN${NC}"
echo -e "${YELLOW}📝 Logları görmek için: docker-compose logs -f${NC}"
echo -e "${YELLOW}🔄 Yeniden başlatmak için: docker-compose restart${NC}"
echo -e "${YELLOW}🛑 Durdurmak için: docker-compose down${NC}" 