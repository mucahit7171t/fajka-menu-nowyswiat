import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

const defaultCategories = [
  { title: { en: "Snacks", pl: "Snacks" }, anchorId: "snacks", image: "/product-default.jpg", order: 0 },
  { title: { en: "Classic Shisha", pl: "Classic Shisha" }, anchorId: "classic-shisha", image: "/product-default.jpg", order: 1 },
  { title: { en: "Shisha With Alcohol", pl: "Shisha With Alcohol" }, anchorId: "shisha-alcohol", image: "/product-default.jpg", order: 2 },
  { title: { en: "Premium Shisha", pl: "Premium Shisha" }, anchorId: "premium-shisha", image: "/product-default.jpg", order: 3 },
  { title: { en: "Klasyczne Drinki", pl: "Klasyczne Drinki" }, anchorId: "classic-drinks", image: "/product-default.jpg", order: 4 },
  { title: { en: "Butelki", pl: "Butelki" }, anchorId: "bottles", image: "/product-default.jpg", order: 5 },
  { title: { en: "Hot Drinks", pl: "Hot Drinks" }, anchorId: "hot-drinks", image: "/product-default.jpg", order: 6 },
];

export async function GET() {
  try {
    await connectDB();

    for (const cat of defaultCategories) {
      await Category.findOneAndUpdate(
        { anchorId: cat.anchorId },
        { $setOnInsert: cat },
        { upsert: true }
      );
    }

    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    const products = await Product.find().sort({ order: 1, createdAt: -1 });

    const menu = categories.map((cat) => ({
      _id: String(cat._id),
      title: cat.title,
      anchorId: cat.anchorId,
      image: cat.image || "/product-default.jpg",
      order: cat.order || 0,
      subcategories: [],
      products: products
        .filter((p) => {
          const productCategory = p.categoryId || p.category || "snacks";
          return productCategory === cat.anchorId || productCategory === String(cat._id);
        })
        .map((p) => ({
          _id: String(p._id),
          name: p.name,
          desc: p.desc,
          price: p.price,
          prices: p.prices || [],
          image: p.image,
          badge: p.badge || "",
          category: p.categoryId,
          categoryId: p.categoryId,
          order: p.order,
        })),
    }));

    return NextResponse.json(menu);
  } catch (error) {
    console.error("GET ADMIN MENU ERROR:", error);
    return NextResponse.json(
      { error: "Admin menu could not be fetched" },
      { status: 500 }
    );
  }
}