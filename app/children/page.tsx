"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Child = {
  id: string;
  name: string;
  points: number;
};

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  async function fetchChildren() {
    const { data, error } = await supabase
      .from("children")
      .select("id, name, points")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setChildren(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-4xl font-black">Children</h1>

        <p className="mb-10 text-white/70">
          View all children added to your family rewards platform.
        </p>

        {loading && <p className="text-white/70">Loading children...</p>}

        {!loading && children.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            No children added yet.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {children.map((child) => (
            <div
              key={child.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-4 text-5xl">👦</div>

              <h2 className="mb-2 text-2xl font-black">{child.name}</h2>

              <p className="rounded-xl bg-blue-600/20 p-4 text-xl font-bold text-blue-200">
                ⭐ {Number(child.points || 0)} Points
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}