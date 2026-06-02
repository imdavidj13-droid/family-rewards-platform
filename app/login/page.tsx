import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-black text-white">
            R
          </div>

          <h1 className="text-5xl font-black">Welcome to Family Rewards</h1>

          <p className="mt-4 text-lg text-slate-600">
            Choose how you want to continue.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <Link
            href="/parent-login"
            className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-5xl">
              👨‍👩‍👧
            </div>

            <h2 className="text-3xl font-black">Parent</h2>

            <p className="mt-3 text-slate-600">
              Manage children, tasks, rewards and approvals.
            </p>

            <div className="mt-8 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-black text-white">
              Parent Login →
            </div>
          </Link>

          <Link
            href="/child-login"
            className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-5xl">
              🧒
            </div>

            <h2 className="text-3xl font-black">Child</h2>

            <p className="mt-3 text-slate-600">
              Complete tasks, earn points and request rewards.
            </p>

            <div className="mt-8 inline-flex rounded-2xl bg-green-600 px-5 py-3 font-black text-white">
              Child Login →
            </div>
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          New to Family Rewards?{" "}
          <Link href="/signup" className="font-black text-blue-600">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}