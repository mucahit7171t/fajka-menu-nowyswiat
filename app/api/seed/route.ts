import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import { initialCategories } from "@/lib/menu-data";

export async function GET() {
  try {
    await connectDB();

    await Product.deleteMany({});

    const products = initialCategories.flatMap((category, categoryIndex) =>
      category.items.map((item, itemIndex) => ({
        name: {
          pl: item.name,
          en: item.name,
        },
        desc: {
          pl: item.description,
          en: item.description,
        },
        price: item.price,
        badge: item.badge || "",
        prices: [],
        categoryId: category.id,
        image: "",
        isActive: true,
        order: categoryIndex * 100 + itemIndex,
      }))
    );

    await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: "Menu data moved to MongoDB",
      count: products.length,
    });
  } catch (error) {
    console.error("SEED ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Seed failed" },
      { status: 500 }
    );
  }
}