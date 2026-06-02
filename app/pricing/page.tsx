import Navbar from "@/components/Navbar";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="font-black text-red-600">Simple Pricing</p>

          <h1 className="mt-4 text-5xl font-black text-slate-900 md:text-6xl">
            Pricing for every family.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Start free and upgrade when your family is ready for more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Free */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">Free</h2>

            <div className="mt-4">
              <span className="text-5xl font-black">£0</span>
              <span className="text-slate-500">/month</span>
            </div>

            <p className="mt-4 text-slate-500">
              Perfect for trying Family Rewards.
            </p>

            <ul className="mt-8 space-y-3 text-slate-700">
              <li>✓ 1 Family</li>
              <li>✓ 1 Child</li>
              <li>✓ 5 Tasks</li>
              <li>✓ 3 Rewards</li>
              <li>✓ Basic Dashboard</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl border border-slate-300 p-4 font-black">
              Start Free
            </button>
          </div>

          {/* Family */}
          <div className="relative rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-xl">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-black text-white">
              MOST POPULAR
            </div>

            <h2 className="text-2xl font-black">Family</h2>

            <div className="mt-4">
              <span className="text-5xl font-black">£4.99</span>
              <span className="text-slate-500">/month</span>
            </div>

            <p className="mt-4 text-slate-500">
              Everything most families need.
            </p>

            <ul className="mt-8 space-y-3 text-slate-700">
              <li>✓ Unlimited Children</li>
              <li>✓ Unlimited Tasks</li>
              <li>✓ Unlimited Rewards</li>
              <li>✓ Child Accounts</li>
              <li>✓ Realtime Updates</li>
              <li>✓ Themes</li>
              <li>✓ Avatar Uploads</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl bg-blue-600 p-4 font-black text-white">
              Get Started
            </button>
          </div>

          {/* School */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black">Schools</h2>

            <div className="mt-4">
              <span className="text-5xl font-black">£49</span>
              <span className="text-slate-500">/month</span>
            </div>

            <p className="mt-4 text-slate-500">
              Built for classrooms and schools.
            </p>

            <ul className="mt-8 space-y-3 text-slate-700">
              <li>✓ Teacher Accounts</li>
              <li>✓ Class Points</li>
              <li>✓ Parent Feed</li>
              <li>✓ School Reports</li>
              <li>✓ Priority Support</li>
              <li>✓ Future School Features</li>
            </ul>

            <button className="mt-8 w-full rounded-2xl border border-slate-300 p-4 font-black">
              Contact Us
            </button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-black">
            Frequently Asked Questions
          </h2>

          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-left">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-black">
                Can I cancel anytime?
              </h3>
              <p className="mt-2 text-slate-500">
                Yes. There are no contracts and you can cancel whenever you like.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-black">
                Is there a free plan?
              </h3>
              <p className="mt-2 text-slate-500">
                Yes. You can start completely free before upgrading.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-black">
                Do children need their own accounts?
              </h3>
              <p className="mt-2 text-slate-500">
                Child accounts are available on paid plans and can be linked by parents.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}