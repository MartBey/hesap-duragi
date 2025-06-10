import mongoose from 'mongoose';

const PopularCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    required: true,
    default: 'КУПИТЬ'
  },
  buttonLink: {
    type: String,
    required: true,
    trim: true
  },
  backgroundImage: {
    type: String,
    required: true,
    trim: true
  },
  gradientFrom: {
    type: String,
    required: true,
    default: 'from-orange-600'
  },
  gradientTo: {
    type: String,
    required: true,
    default: 'to-red-800'
  },
  textColor: {
    type: String,
    required: true,
    default: 'text-white'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Index for ordering
PopularCategorySchema.index({ order: 1 });
PopularCategorySchema.index({ isActive: 1 });

export default mongoose.models.PopularCategory || mongoose.model('PopularCategory', PopularCategorySchema); 