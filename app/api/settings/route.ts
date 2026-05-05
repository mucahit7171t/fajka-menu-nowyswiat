import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

const defaultSettings = {
  siteName: "FAJKA BAR",
  location: "Warsaw",
  currency: "zł",
  language: "pl",
  isOpen: true,
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

export async function GET() {
  try {
    await connectDB();

    let settings = await Settings.findOne({ key: "site-settings" });

    if (!settings) {
      settings = await Settings.create({
        key: "site-settings",
        value: defaultSettings,
      });
    }

    return NextResponse.json(settings.value);
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);
    return NextResponse.json(defaultSettings);
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const current = await Settings.findOne({ key: "site-settings" });

    const updatedValue = {
      ...(current?.value || defaultSettings),
      ...body,
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
    console.error("UPDATE SETTINGS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Settings update failed" },
      { status: 500 }
    );
  }
}