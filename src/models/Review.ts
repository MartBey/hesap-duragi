import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Bir kullanıcı aynı hesap için sadece bir değerlendirme yapabilir
reviewSchema.index({ user: 1, account: 1 }, { unique: true });

// Hesap bazında ortalama rating hesaplama için index
reviewSchema.index({ account: 1, isApproved: 1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review; 