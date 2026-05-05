import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { type, items } = body;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    if (type === "category") {
      await Promise.all(
        items.map((item: any) =>
          Category.findByIdAndUpdate(item.id, {
            order: item.order,
          })
        )
      );
    }

    if (type === "product") {
      await Promise.all(
        items.map((item: any) =>
          Product.findByIdAndUpdate(item.id, {
            order: item.order,
          })
        )
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REORDER ERROR:", error);
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }
}