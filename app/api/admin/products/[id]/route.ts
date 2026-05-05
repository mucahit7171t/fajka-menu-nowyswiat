import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...body,
        categoryId: body.categoryId || body.category || "",
        badge: body.badge ?? "",
      },
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("ADMIN UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Product update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Product delete failed" },
      { status: 500 }
    );
  }
}