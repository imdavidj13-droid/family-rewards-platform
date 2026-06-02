import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type TableName = "children" | "tasks" | "rewards" | "redemptions";

export function useRealtime(table: TableName, callback: () => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
        },
        () => {
          callbackRef.current();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);
}