import mongoose, { Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      pl: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    desc: {
      pl: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    price: { type: String, default: "" },

    badge: {
      type: String,
      enum: ["Best Seller", "Premium", "New", ""],
      default: "",
    },

    prices: [
      {
        label: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
    categoryId: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", ProductSchema);

export default Product;