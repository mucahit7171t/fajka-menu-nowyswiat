import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export async function GET() {
  try {
    await connectDB();

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
          const productCategory = p.categoryId || p.category || "";
          return (
            productCategory === cat.anchorId ||
            productCategory === String(cat._id)
          );
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