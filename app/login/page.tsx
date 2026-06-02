"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setMessage("Login failed. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      setMessage(profileError.message);
      return;
    }

    if (profile?.role === "child") {
      window.location.href = "/child";
      return;
    }

    window.location.href = "/dashboard";
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
          Welcome back. Sign in to manage rewards and achievements.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <h2 className="mb-6 text-2xl font-black text-white">
          Login
        </h2>

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
          onClick={login}
          className="w-full rounded-2xl bg-blue-600 p-4 font-black text-white transition hover:bg-blue-500"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-center font-bold text-slate-300">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-bold text-blue-400 hover:text-blue-300"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  </main>
);}