import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        title: body.title,
        anchorId: body.anchorId,
        image: body.image || "",
        order: body.order || 0,
      },
      { returnDocument: "after" }
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("ADMIN UPDATE CATEGORY ERROR:", error);
    return NextResponse.json(
      { error: "Category update failed" },
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
    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN DELETE CATEGORY ERROR:", error);
    return NextResponse.json(
      { error: "Category delete failed" },
      { status: 500 }
    );
  }
}