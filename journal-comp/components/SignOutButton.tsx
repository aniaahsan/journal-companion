"use client";
import { supabase } from "@/lib/supabaseClient";

export default function SignOutButton() {
  return (
    <button
      className="px-3 py-2 rounded-md bg-black text-white"
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }}
    >
      Sign out
    </button>
  );
}
