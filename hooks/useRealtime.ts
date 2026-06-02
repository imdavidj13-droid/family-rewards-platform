import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type TableName = "children" | "tasks" | "rewards" | "redemptions";

export function useRealtime(table: TableName, callback: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
}