import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const product = await Product.create({
      ...body,
      categoryId: body.categoryId || body.category || "",
      isActive: true,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("ADMIN CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Product could not be created" },
      { status: 500 }
    );
  }
}