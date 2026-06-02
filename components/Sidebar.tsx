"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

export default function Sidebar() {
  const { theme } = useTheme();

  return (
    <aside
      className={`hidden w-64 shrink-0 border-r ${theme.border} ${theme.sidebarBg} p-5 md:flex md:min-h-screen md:flex-col`}
    >
      <div
        className={`mb-8 flex items-center gap-3 text-xl font-black ${theme.primaryText}`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.primaryBg} text-white`}
        >
          ★
        </div>

        Family Rewards
      </div>

      <nav className="space-y-2">
        <NavItem href="/dashboard" icon="📊" label="Dashboard" />
        <NavItem href="/children" icon="👦" label="Children" />
        <NavItem href="/tasks" icon="📋" label="Tasks" />
        <NavItem href="/rewards" icon="🎁" label="Rewards" />
        <NavItem href="/redemptions" icon="✅" label="Redemptions" />
        <NavItem href="/reports" icon="📈" label="Reports" />
        <NavItem href="/achievements" icon="🏆" label="Achievements" />
        <NavItem href="/family-feed" icon="📰" label="Family Feed" />
        <NavItem href="/settings" icon="⚙️" label="Settings" />
      </nav>

      <div
        className={`mt-auto rounded-3xl border ${theme.border} ${theme.softBg} p-4`}
      >
        <p className={`font-black ${theme.text}`}>Parent Account</p>

        <p className={`text-sm ${theme.mutedText}`}>
          Family admin
        </p>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  const { theme } = useTheme();

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold ${theme.mutedText} transition hover:${theme.softAccentBg} hover:${theme.primaryText}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}