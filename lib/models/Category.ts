import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      pl: { type: String, required: true },
      en: { type: String, required: true },
    },
    anchorId: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);