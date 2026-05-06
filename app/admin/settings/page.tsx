"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Phone, Globe, Plus, Trash2, Clock } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";
import toast from "react-hot-toast";

type Notice = {
  icon: string;
  text: string;
  order: number;
  isActive: boolean;
};

type OpeningHour = {
  day: string;
  label: string;
};

const defaultOpeningHours: OpeningHour[] = [
  { day: "Monday", label: "04:00 PM - 03:00 AM" },
  { day: "Tuesday", label: "04:00 PM - 03:00 AM" },
  { day: "Wednesday", label: "04:00 PM - 04:00 AM" },
  { day: "Thursday", label: "04:00 PM - 04:00 AM" },
  { day: "Friday", label: "02:00 PM - 05:00 AM" },
  { day: "Saturday", label: "02:00 PM - 05:00 AM" },
  { day: "Sunday", label: "03:00 PM - 04:00 AM" },
];

export default function SettingsPage() {
  const { settings, loading, fetchSettings, updateSetting } = useSettingsStore();

  const [phone, setPhone] = useState("");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [openingHours, setOpeningHours] =
    useState<OpeningHour[]>(defaultOpeningHours);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    setPhone(settings.phone || "+48 000 000 000");

    if (Array.isArray(settings.openingHours) && settings.openingHours.length > 0) {
      setOpeningHours(settings.openingHours);
    } else {
      setOpeningHours(defaultOpeningHours);
    }

    if (Array.isArray(settings.notices)) {
      setNotices(
        settings.notices
          .map((item: Notice, index: number) => ({
            icon: item.icon || "ℹ️",
            text: item.text || "",
            order: item.order ?? index,
            isActive: item.isActive !== false,
          }))
          .sort((a: Notice, b: Notice) => a.order - b.order)
      );
    }
  }, [settings]);

  const addNotice = () => {
    setNotices([
      ...notices,
      {
        icon: "ℹ️",
        text: "",
        order: notices.length,
        isActive: true,
      },
    ]);
  };

  const updateNotice = (index: number, field: keyof Notice, value: any) => {
    const updated = [...notices];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setNotices(updated);
  };

  const removeNotice = (index: number) => {
    const updated = notices
      .filter((_, i) => i !== index)
      .map((item, order) => ({ ...item, order }));
    setNotices(updated);
  };

  const updateOpeningHour = (
    index: number,
    field: keyof OpeningHour,
    value: string
  ) => {
    const updated = [...openingHours];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setOpeningHours(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const loadingToast = toast.loading("Updating settings...");

    try {
      const normalizedNotices = notices.map((item, index) => ({
        ...item,
        order: index,
      }));

      await updateSetting("phone", phone);
      await updateSetting("notices", normalizedNotices);
      await updateSetting("openingHours", openingHours);

      toast.success("Settings updated successfully", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h1 className="text-3xl md:text-6xl font-serif font-black italic tracking-tighter mb-2 uppercase text-white">
          SETTINGS<span className="text-[#c8a24a]">.</span>
        </h1>
        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest leading-none">
          Manage global website configuration
        </p>
      </header>

      {loading && !Object.keys(settings).length ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-[#c8a24a]" size={40} />
          <p className="text-white/20 uppercase tracking-[0.3em] font-bold text-[10px]">
            Loading Configs...
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-white/5 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSave} className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#c8a24a]/10 flex items-center justify-center text-[#c8a24a] border border-[#c8a24a]/20">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Booking Phone Number
                  </h3>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                    Displayed in the client menu
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+48 000 000 000"
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-6 px-8 text-lg font-serif italic text-white focus:border-[#c8a24a] transition-all outline-none"
              />
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#c8a24a]/10 flex items-center justify-center text-[#c8a24a] border border-[#c8a24a]/20">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Opening Hours
                  </h3>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                    Edit opening hours shown on customer menu
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {openingHours.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) =>
                        updateOpeningHour(index, "day", e.target.value)
                      }
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white font-bold outline-none focus:border-[#c8a24a]/60"
                    />

                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        updateOpeningHour(index, "label", e.target.value)
                      }
                      placeholder="04:00 PM - 03:00 AM"
                      className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white font-bold outline-none focus:border-[#c8a24a]/60"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    UWAGA Notices
                  </h3>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                    Add, edit, hide or delete customer notice texts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addNotice}
                  className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                  <Plus size={16} />
                  Add Notice
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((notice, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[90px_1fr_auto] gap-3">
                      <input
                        type="text"
                        value={notice.icon}
                        onChange={(e) =>
                          updateNotice(index, "icon", e.target.value)
                        }
                        placeholder="👥"
                        className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white font-bold outline-none focus:border-[#c8a24a]/60"
                      />

                      <textarea
                        value={notice.text}
                        onChange={(e) =>
                          updateNotice(index, "text", e.target.value)
                        }
                        placeholder="Notice text..."
                        className="min-h-[80px] resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white font-medium outline-none focus:border-[#c8a24a]/60"
                      />

                      <button
                        type="button"
                        onClick={() => removeNotice(index)}
                        className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                      <input
                        type="checkbox"
                        checked={notice.isActive}
                        onChange={(e) =>
                          updateNotice(index, "isActive", e.target.checked)
                        }
                      />
                      Active on customer menu
                    </label>
                  </div>
                ))}

                {notices.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
                    No notices yet
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="group flex items-center gap-3 px-10 py-5 bg-[#c8a24a] text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:brightness-110 disabled:opacity-50 transition-all shadow-xl shadow-[#c8a24a]/20"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save
                    size={16}
                    className="group-hover:scale-125 transition-transform"
                  />
                )}
                Save Settings
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex items-center gap-4 p-8 bg-[#c8a24a]/5 border border-[#c8a24a]/10 rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-[#c8a24a]/20 flex items-center justify-center text-[#c8a24a] shrink-0">
          <Globe size={24} />
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed font-medium uppercase tracking-wider">
          Pro Tip: Notices and opening hours appear in the customer menu.
        </p>
      </div>
    </div>
  );
}