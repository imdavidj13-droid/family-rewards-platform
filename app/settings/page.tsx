import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black md:text-4xl">
              Settings ⚙️
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your family rewards preferences.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Family Settings</h2>

              <div className="mt-6 space-y-4">
                <SettingRow label="Family Name" value="Your Family" />
                <SettingRow label="Default Points" value="10 points" />
                <SettingRow label="Reward Approval" value="Required" />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Theme</h2>

              <p className="mt-2 text-gray-500">
                Theme System 2.0 will be added after the page redesigns.
              </p>

              <div className="mt-6 grid gap-3">
                <button className="rounded-2xl bg-red-600 px-4 py-3 font-black text-white">
                  Classic Red
                </button>

                <button className="rounded-2xl border border-gray-200 bg-white px-4 py-3 font-black text-gray-700">
                  Blue Theme
                </button>

                <button className="rounded-2xl border border-gray-200 bg-white px-4 py-3 font-black text-gray-700">
                  Trophy Gold
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
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
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
      <span className="font-bold text-gray-500">{label}</span>
      <span className="font-black text-gray-900">{value}</span>
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
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-2xl">
        {icon}
      </div>

      <p className="text-sm font-bold text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-black text-gray-900">{value}</p>
    </div>
  );
}