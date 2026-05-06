import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/lib/models/Settings";

const defaultOpeningHours = [
  { day: "Monday", label: "04:00 PM - 03:00 AM" },
  { day: "Tuesday", label: "04:00 PM - 03:00 AM" },
  { day: "Wednesday", label: "04:00 PM - 04:00 AM" },
  { day: "Thursday", label: "04:00 PM - 04:00 AM" },
  { day: "Friday", label: "02:00 PM - 05:00 AM" },
  { day: "Saturday", label: "02:00 PM - 05:00 AM" },
  { day: "Sunday", label: "03:00 PM - 04:00 AM" },
];

const defaultSettings = {
  siteName: "FAJKA BAR",
  location: "Warsaw",
  currency: "zł",
  language: "pl",
  isOpen: true,
  phone: "+48 000 000 000",
  openingHours: defaultOpeningHours,
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

    return NextResponse.json({
      success: true,
      settings: {
        ...defaultSettings,
        ...(settings.value || {}),
        openingHours:
          Array.isArray(settings.value?.openingHours) &&
          settings.value.openingHours.length > 0
            ? settings.value.openingHours
            : defaultOpeningHours,
      },
    });
  } catch (error) {
    console.error("ADMIN SETTINGS GET ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Settings load failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const current = await Settings.findOne({ key: "site-settings" });

    let updatedValue;

    if ("key" in body && "value" in body) {
      updatedValue = {
        ...defaultSettings,
        ...(current?.value || {}),
        [body.key]: body.value,
      };
    } else {
      updatedValue = {
        ...defaultSettings,
        ...(current?.value || {}),
        ...body,
      };
    }

    const settings = await Settings.findOneAndUpdate(
      { key: "site-settings" },
      { value: updatedValue },
      { upsert: true, new: true }
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