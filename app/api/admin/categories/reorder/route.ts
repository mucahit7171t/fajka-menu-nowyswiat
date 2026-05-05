import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/lib/models/Category";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const updates = body.map((item: any) =>
      Category.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REORDER CATEGORIES ERROR:", error);
    return NextResponse.json(
      { error: "Failed to reorder categories" },
      { status: 500 }
    );
  }
}