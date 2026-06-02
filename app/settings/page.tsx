"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { themes, type ThemeName } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  role: "parent" | "child";
  avatar_url: string | null;
};

export default function SettingsPage() {
  const { theme, selectedTheme, changeTheme } = useTheme();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, name, role, avatar_url")
      .eq("user_id", user.id)
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setProfile(data);
    setName(data.name || "");
    setAvatarUrl(data.avatar_url || null);
  }

  async function saveProfile() {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", profile.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile updated successfully!");
    loadProfile();
  }

  async function uploadAvatar(file: File) {
    if (!profile) return;

    setMessage("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setMessage(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", profile.id);

    if (updateError) {
      setMessage(updateError.message);
      return;
    }

    setAvatarUrl(publicUrl);
    setMessage("Avatar updated successfully!");
    loadProfile();
  }

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black md:text-4xl">Settings ⚙️</h1>
            <p className={`mt-2 ${theme.mutedText}`}>
              Manage your profile, avatar and platform preferences.
            </p>
          </div>

          {message && (
            <div className={`mb-6 rounded-2xl border ${theme.border} ${theme.cardBg} p-4 font-bold`}>
              {message}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <h2 className="text-xl font-black">Profile</h2>

              <div className="mt-6 flex items-center gap-5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || "Avatar"}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${theme.primaryBg} text-3xl font-black text-white`}>
                    {(name || "U")[0].toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-2xl font-black">{name || "User"}</p>
                  <p className={`text-sm font-bold uppercase ${theme.mutedText}`}>
                    {profile?.role === "child" ? "Child" : "Parent"}
                  </p>
                  <p className={`text-sm ${theme.mutedText}`}>
                    {profile?.role === "child" ? "Reward earner" : "Family admin"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={`mb-2 block text-sm font-bold ${theme.mutedText}`}>
                    Profile name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text} outline-none ${theme.focusBorder}`}
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-bold ${theme.mutedText}`}>
                    Upload avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadAvatar(file);
                    }}
                    className={`w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-bold ${theme.text}`}
                  />
                </div>

                <button
                  onClick={saveProfile}
                  className={`w-full rounded-2xl px-5 py-4 font-black ${theme.button}`}
                >
                  Save Profile
                </button>
              </div>
            </div>

            <div className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
              <h2 className="text-xl font-black">Theme</h2>
              <p className={`mt-2 ${theme.mutedText}`}>
                Choose a colour system for the whole platform.
              </p>

              <select
                value={selectedTheme}
                onChange={(e) => changeTheme(e.target.value as ThemeName)}
                className={`mt-6 w-full rounded-2xl border ${theme.border} ${theme.softBg} p-4 font-black ${theme.text} outline-none ${theme.focusBorder}`}
              >
                {Object.entries(themes).map(([themeKey, themeValue]) => (
                  <option key={themeKey} value={themeKey}>
                    {themeValue.name}
                  </option>
                ))}
              </select>

              <div className="mt-6 grid gap-3">
                {Object.entries(themes).map(([themeKey, themeValue]) => (
                  <button
                    key={themeKey}
                    onClick={() => changeTheme(themeKey as ThemeName)}
                    className={`rounded-2xl px-4 py-3 font-black transition ${
                      selectedTheme === themeKey
                        ? theme.button
                        : `border ${theme.border} ${theme.cardBg} ${theme.text} hover:bg-gray-100`
                    }`}
                  >
                    {themeValue.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`mt-6 rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}>
            <h2 className="text-xl font-black">Account</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard icon="👤" label="Role" value={profile?.role === "child" ? "Child" : "Parent"} />
              <InfoCard icon="📧" label="Email" value={email || "Unknown"} />
              <InfoCard icon="🎁" label="Rewards" value="Enabled" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl ${theme.softBg} p-4`}>
      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg} text-2xl`}>
        {icon}
      </div>

      <p className={`text-sm font-bold ${theme.mutedText}`}>{label}</p>
      <p className={`mt-1 break-words text-xl font-black ${theme.text}`}>
        {value}
      </p>
    </div>
  );
}