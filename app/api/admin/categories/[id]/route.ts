import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";

function buildCategoryQuery(id: string) {
  const conditions: any[] = [
    { id },
    { anchorId: id },
    { "title.pl": id },
    { "title.en": id },
  ];

  if (mongoose.Types.ObjectId.isValid(id)) {
    conditions.unshift({ _id: id });
  }

  return { $or: conditions };
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const updatedCategory = await Category.findOneAndUpdate(
      buildCategoryQuery(id),
      {
        title: body.title,
        anchorId: body.anchorId,
        image: body.image || "",
        order: body.order || 0,
      },
      { new: true }
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

    const category = await Category.findOne(buildCategoryQuery(id));

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found", receivedId: id },
        { status: 404 }
      );
    }

    const categoryMongoId = String(category._id);
    const categoryAnchorId = category.anchorId || category.id || categoryMongoId;

    await Product.deleteMany({
      $or: [
        { categoryId: categoryMongoId },
        { categoryId: categoryAnchorId },
        { category: categoryMongoId },
        { category: categoryAnchorId },
      ],
    });

    await Category.findByIdAndDelete(categoryMongoId);

    return NextResponse.json({
      success: true,
      deletedCategory: category.title,
      deletedId: categoryMongoId,
      deletedAnchorId: categoryAnchorId,
    });
  } catch (error) {
    console.error("ADMIN DELETE CATEGORY ERROR:", error);
    return NextResponse.json(
      { error: "Category delete failed" },
      { status: 500 }
    );
  }
}