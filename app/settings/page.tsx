"use client";

import Sidebar from "@/components/Sidebar";
import { themes, type ThemeName } from "@/lib/themes";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { theme, selectedTheme, changeTheme } = useTheme();

  return (
    <main className={`min-h-screen ${theme.pageBg} ${theme.text}`}>
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black md:text-4xl">
              Settings ⚙️
            </h1>

            <p className={`mt-2 ${theme.mutedText}`}>
              Manage your family rewards preferences.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
              <h2 className="text-xl font-black">Family Settings</h2>

              <div className="mt-6 space-y-4">
                <SettingRow label="Family Name" value="Your Family" />
                <SettingRow label="Default Points" value="10 points" />
                <SettingRow label="Reward Approval" value="Required" />
              </div>
            </div>

            <div
              className={`rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
            >
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

          <div
            className={`mt-6 rounded-3xl border ${theme.border} ${theme.cardBg} p-6 shadow-sm`}
          >
            <h2 className="text-xl font-black">Account</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard icon="👤" label="Role" value="Parent" />
              <InfoCard icon="👦" label="Children" value="Managed" />
              <InfoCard icon="🎁" label="Rewards" value="Enabled" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center justify-between rounded-2xl ${theme.softBg} p-4`}
    >
      <span className={`font-bold ${theme.mutedText}`}>{label}</span>
      <span className={`font-black ${theme.text}`}>{value}</span>
    </div>
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
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconBg} text-2xl`}
      >
        {icon}
      </div>

      <p className={`text-sm font-bold ${theme.mutedText}`}>{label}</p>
      <p className={`mt-1 text-xl font-black ${theme.text}`}>{value}</p>
    </div>
  );
}