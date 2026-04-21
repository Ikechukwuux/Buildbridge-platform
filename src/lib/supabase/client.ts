import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Browser / Client Components.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn("Supabase credentials missing. Supabase features will be disabled.");
    }
    return null;
  }

  return createBrowserClient(url, key);
}
