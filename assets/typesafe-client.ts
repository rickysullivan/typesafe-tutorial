// Shared TypeSafe client setup, imported by every lesson notebook.
//
// NOTE: loading .env via the Deno std dotenv module inside the Deno
// Jupyter kernel hasn't been hands-on verified yet in this project
// (see NOTES.md / research/typesafe-ai.md open items). If
// TYPESAFE_API_KEY isn't picked up, export it in your shell before
// launching VS Code instead.
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
