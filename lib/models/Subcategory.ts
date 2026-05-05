import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  title: {
    pl: { type: String, required: true },
    en: { type: String, required: true },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
