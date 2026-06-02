"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signUp() {
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: data.user.id,
          name,
          role: "parent",
        });

      if (profileError) {
        setMessage(profileError.message);
        return;
      }
    }

    setMessage("Account created successfully!");
  }

  return (
  <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-black p-6">
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mb-4 text-6xl">🏆</div>

        <h1 className="text-4xl font-black text-white">
          Family Rewards
        </h1>

        <p className="mt-3 text-slate-400">
          Create your family account and start rewarding success.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-black text-white">
          Create Account
        </h2>

        <input
          className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-white placeholder-slate-500 outline-none focus:border-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signUp}
          className="w-full rounded-2xl bg-blue-600 p-4 font-black text-white transition hover:bg-blue-500"
        >
          Create Account
        </button>

        {message && (
          <p className="mt-4 text-center font-bold text-slate-300">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-bold text-blue-400 hover:text-blue-300"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  </main>
);}