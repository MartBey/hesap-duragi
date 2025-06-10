import mongoose, { Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  title: string;
  description: string;
  game: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  isOnSale: boolean;
  isFeatured: boolean;
  isWeeklyDeal: boolean;
  category: string;
  subcategory: string;
  features: string[];
  emoji: string;
  images: string[];
  status: 'available' | 'sold' | 'pending' | 'suspended';
  level: string;
  rank: string;
  rating: number;
  reviews: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isWeeklyDeal: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  emoji: {
    type: String,
    default: '🎮'
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'pending', 'suspended'],
    default: 'available'
  },
  level: {
    type: String,
    default: '1'
  },
  rank: {
    type: String,
    default: 'Unranked'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 1,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
AccountSchema.index({ game: 1, status: 1 });
AccountSchema.index({ category: 1, status: 1 });
AccountSchema.index({ price: 1 });
AccountSchema.index({ title: 'text', description: 'text' });
AccountSchema.index({ isWeeklyDeal: 1 });
AccountSchema.index({ isOnSale: 1 });
AccountSchema.index({ isFeatured: 1 });

// Fiyat değişikliğinde orijinal fiyatı güncelle
AccountSchema.pre('save', function(next) {
  if (this.isModified('price') && !this.isModified('originalPrice')) {
    this.originalPrice = this.price;
  }
  next();
});

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema); 