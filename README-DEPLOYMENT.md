# 🚀 HesapDurağı VDS Deployment Rehberi

Bu rehber, HesapDurağı projesini VDS sunucunuzda Docker ile nasıl deploy edeceğinizi adım adım anlatır.

## 📋 Gereksinimler

### VDS Sunucu Gereksinimleri:
- **RAM**: Minimum 2GB (4GB önerilen)
- **Disk**: Minimum 20GB SSD
- **CPU**: 2 Core (önerilen)
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### Yazılım Gereksinimleri:
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Curl

## 🛠️ VDS Kurulum Adımları

### 1. VDS'e Bağlanın
```bash
ssh root@your-vds-ip
```

### 2. Sistem Güncellemesi
```bash
# Ubuntu/Debian için
apt update && apt upgrade -y

# CentOS için
yum update -y
```

### 3. Docker Kurulumu
```bash
# Ubuntu/Debian için
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Docker Compose kurulumu
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 4. Proje Dosyalarını Yükleyin

#### Seçenek A: Git ile (Önerilen)
```bash
git clone https://github.com/your-username/hesapduragi.git
cd hesapduragi
```

#### Seçenek B: Manuel Upload
- Proje dosyalarını WinSCP/FileZilla ile sunucuya yükleyin
- `/var/www/hesapduragi` klasörüne yerleştirin

### 5. Konfigürasyon

#### Environment Dosyası Oluşturun:
```bash
cp .env.example .env.production
nano .env.production
```

#### Gerekli Değişiklikleri Yapın:
```env
NODE_ENV=production
MONGODB_URI=mongodb://admin:GÜÇLÜ_ŞİFRE@mongo:27017/hesapduragi?authSource=admin
NEXTAUTH_SECRET=ÇOKGÜÇLÜBIR_SECRET_KEY_BURAYA
NEXTAUTH_URL=https://hesapduragi.com
JWT_SECRET=BAŞKA_BİR_GÜÇLÜ_SECRET
```

#### Nginx Konfigürasyonunu Güncelleyin:
```bash
nano nginx/nginx.conf
# "your-domain.com" kısımlarını kendi domain'inizle değiştirin
```

### 6. Deployment

#### Otomatik Deployment (Önerilen):
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### Manuel Deployment:
```bash
# Build
docker-compose build

# Başlat
docker-compose up -d

# Durumu kontrol et
docker-compose ps
```

## 🔒 SSL Sertifikası (Let's Encrypt)

### Otomatik Kurulum:
Deploy script'i çalıştırırken SSL seçeneğini seçin.

### Manuel Kurulum:
```bash
# Certbot ile sertifika al
docker run -it --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/nginx/ssl:/var/www/certbot \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@domain.com \
  --agree-tos \
  --no-eff-email \
  -d your-domain.com -d www.your-domain.com

# Nginx'i yeniden başlat
docker-compose restart nginx
```

## 🔧 Yönetim Komutları

### Container Yönetimi:
```bash
# Durumu görüntüle
docker-compose ps

# Logları görüntüle
docker-compose logs -f

# Yeniden başlat
docker-compose restart

# Durdur
docker-compose down

# Güncelleme
git pull
docker-compose build
docker-compose up -d
```

### Database Yönetimi:
```bash
# MongoDB'ye bağlan
docker-compose exec mongo mongosh -u admin -p

# Database backup
docker-compose exec mongo mongodump --host localhost --port 27017 --db hesapduragi --out /backup

# Database restore
docker-compose exec mongo mongorestore --host localhost --port 27017 --db hesapduragi /backup/hesapduragi
```

## 🔍 Sorun Giderme

### Yaygın Sorunlar:

#### 1. Port 80/443 Kullanımda
```bash
# Hangi servis kullanıyor kontrol et
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Apache/Nginx durdur
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### 2. Docker Permission Hatası
```bash
sudo usermod -aG docker $USER
newgrp docker
```

#### 3. Memory Yetersizliği
```bash
# Swap ekle
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### 4. Container Başlamıyor
```bash
# Detaylı log
docker-compose logs app

# Container içine gir
docker-compose exec app sh
```

## 📊 Monitoring

### Sistem Durumu:
```bash
# Resource kullanımı
docker stats

# Disk kullanımı
df -h

# Memory kullanımı
free -h
```

### Uygulama Durumu:
```bash
# Health check
curl -f http://localhost:3000/api/health

# Response time test
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000
```

## 🔄 Güncelleme Süreci

```bash
# 1. Backup al
docker-compose exec mongo mongodump --out /backup/$(date +%Y%m%d)

# 2. Kodu güncelle
git pull

# 3. Rebuild ve restart
docker-compose build
docker-compose up -d

# 4. Test et
curl -f http://localhost:3000
```

## 🆘 Destek

Sorun yaşarsanız:
1. Logları kontrol edin: `docker-compose logs -f`
2. Container durumunu kontrol edin: `docker-compose ps`
3. System resource'ları kontrol edin: `htop`

## 📞 İletişim

- **Email**: support@hesapduragi.com
- **GitHub**: https://github.com/your-username/hesapduragi
- **Dokümantasyon**: https://docs.hesapduragi.com 