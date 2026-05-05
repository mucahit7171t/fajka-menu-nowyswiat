import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

export const revalidate = 60;

function toStr(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return String(value);
}

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const products = await Product.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const menu = categories.map((cat: any) => {
      const catMongoId = String(cat._id);
      const catAnchorId = cat.anchorId || catMongoId;

      const title = {
        pl: cat.title?.pl || cat.title?.en || "",
        en: cat.title?.en || cat.title?.pl || "",
      };

      const items = products
        .filter((p: any) => {
          const productCategoryId = toStr(p.categoryId);
          const productCategory = toStr(p.category);

          return (
            productCategoryId === catMongoId ||
            productCategoryId === catAnchorId ||
            productCategory === catMongoId ||
            productCategory === catAnchorId
          );
        })
        .map((p: any) => ({
          name: {
            pl: p.name?.pl || p.name?.en || "",
            en: p.name?.en || p.name?.pl || "",
          },
          description: {
            pl: p.desc?.pl || p.desc?.en || "",
            en: p.desc?.en || p.desc?.pl || "",
          },
          price: p.price || "",
          prices: Array.isArray(p.prices) ? p.prices : [],
          badge: p.badge || undefined,
          image: p.image || "",
        }));

      return {
        id: catAnchorId,
        title,
        imageLabel: {
          pl: title.pl.toUpperCase(),
          en: title.en.toUpperCase(),
        },
        image: cat.image || "/product-default.jpg",
        items,
      };
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error("GET MENU ERROR:", error);
    return NextResponse.json([]);
  }
}