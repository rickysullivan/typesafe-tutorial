// Shared TypeSafe client setup, imported by every lesson notebook.
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { TypeSafeClient } from "npm:@typesafe-ai/sdk";

await load({ export: true });

const apiKey = Deno.env.get("TYPESAFE_API_KEY");
if (!apiKey) {
  throw new Error(
    "TYPESAFE_API_KEY is not set. Add it to a .env file at the repo root, or export it in your shell. See README.md.",
  );
}

export const client = new TypeSafeClient({ apiKey });
