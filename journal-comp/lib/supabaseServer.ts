// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// Named export: createSupabaseServer
export function createSupabaseServer() {
  // Some versions expect a function that returns the cookie store
  return createServerComponentClient({
    cookies: () => cookies(),
  });
}
