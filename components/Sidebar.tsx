"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";

type Role = "parent" | "child" | null;

export default function Sidebar() {
  const { theme } = useTheme();
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    loadRole();
  }, []);

  async function loadRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    setRole(profile?.role || null);
  }

  const navItems =
    role === "child"
      ? [{ href: "/child", icon: "⭐", label: "My Portal" }]
      : [
          { href: "/dashboard", icon: "📊", label: "Dashboard" },
          { href: "/children", icon: "👦", label: "Children" },
          { href: "/tasks", icon: "📋", label: "Tasks" },
          { href: "/rewards", icon: "🎁", label: "Rewards" },
          { href: "/redemptions", icon: "✅", label: "Redemptions" },
          { href: "/reports", icon: "📈", label: "Reports" },
          { href: "/achievements", icon: "🏆", label: "Achievements" },
          { href: "/family-feed", icon: "📰", label: "Family Feed" },
          { href: "/settings", icon: "⚙️", label: "Settings" },
        ];

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
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      <div
        className={`mt-auto rounded-3xl border ${theme.border} ${theme.softBg} p-4`}
      >
        <p className={`font-black ${theme.text}`}>
          {role === "child" ? "Child Account" : "Parent Account"}
        </p>

        <p className={`text-sm ${theme.mutedText}`}>
          {role === "child" ? "Reward earner" : "Family admin"}
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