import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-5 md:flex md:min-h-screen md:flex-col">
      <div className="mb-8 flex items-center gap-3 text-xl font-black text-red-600">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 text-white">
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

      <div className="mt-auto rounded-3xl border border-gray-200 bg-gray-50 p-4">
        <p className="font-black text-gray-900">Parent Account</p>
        <p className="text-sm text-gray-500">Family admin</p>
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
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}