"use client";
import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl p-6 shadow bg-white">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        <Auth
          supabaseClient={supabase}
          providers={[]}               // no Google/GitHub buttons
          view="magic_link"            // force magic-link view
          magicLink                    // enable magic-link flow
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}