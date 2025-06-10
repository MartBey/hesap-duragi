import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog başlığı gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  slug: {
    type: String,
    required: [true, 'Slug gereklidir'],
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Özet gereklidir'],
    trim: true,
    maxlength: [500, 'Özet 500 karakterden uzun olamaz']
  },
  content: {
    type: String,
    required: [true, 'İçerik gereklidir']
  },
  author: {
    type: String,
    required: [true, 'Yazar gereklidir'],
    default: 'HD Dijital'
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: ['Oyun Rehberleri', 'Güvenlik', 'Sosyal Medya', 'Dijital Hizmetler', 'PC Oyunları']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  readTime: {
    type: String,
    default: '5 dakika'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta başlık 60 karakterden uzun olamaz']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta açıklama 160 karakterden uzun olamaz']
  },
  keywords: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Slug oluşturma middleware
BlogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .trim('-'); // Başta ve sonda tire varsa kaldır
  }
  
  // Meta veriler otomatik doldurma
  if (!this.metaTitle) {
    this.metaTitle = this.title.substring(0, 60);
  }
  
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt.substring(0, 160);
  }
  
  // Yayınlanma tarihi
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// İndeksler
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 