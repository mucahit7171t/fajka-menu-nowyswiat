import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

const defaultSettings = {
  siteName: "FAJKA BAR",
  location: "Warsaw",
  currency: "zł",
  language: "pl",
  isOpen: true,
  phone: "+48 000 000 000",
  notices: [
    {
      icon: "👥",
      text: "Powyżej 3 osób shisha jest sprzedawana tylko przy zakupie napojów.",
      order: 0,
      isActive: true,
    },
    {
      icon: "🥤",
      text: "Prosimy nie spożywać napojów i jedzenia przyniesionego z zewnątrz.",
      order: 1,
      isActive: true,
    },
    {
      icon: "🛋️",
      text: "Za uszkodzenia fajek wodnych, kanap i innych mebli spowodowane nieostrożnym zachowaniem odpowiadają nasi klienci.",
      order: 2,
      isActive: true,
    },
  ],
};

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { key, value } = body;

    const current = await Settings.findOne({ key: "site-settings" });

    const updatedValue = {
      ...(current?.value || defaultSettings),
      [key]: value,
    };

    const settings = await Settings.findOneAndUpdate(
      { key: "site-settings" },
      { value: updatedValue },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      settings: settings.value,
    });
  } catch (error) {
    console.error("ADMIN SETTINGS UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Settings update failed" },
      { status: 500 }
    );
  }
}