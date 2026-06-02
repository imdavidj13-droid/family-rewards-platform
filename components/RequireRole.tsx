"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RequireRoleProps = {
  allowedRole: "parent" | "child";
  children: React.ReactNode;
};

export default function RequireRole({ allowedRole, children }: RequireRoleProps) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkRole();
  }, []);

  async function checkRole() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      window.location.href = "/login";
      return;
    }

    if (profile.role !== allowedRole) {
      window.location.href = profile.role === "child" ? "/child" : "/dashboard";
      return;
    }

    setAllowed(true);
  }

  if (!allowed) {
  return null;
}

  return <>{children}</>;
}