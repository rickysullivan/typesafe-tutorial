// Shared TypeSafe client setup, imported by every lesson notebook.
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { TypeSafeClient } from "npm:@typesafe-ai/sdk@^0.7.0";

await load({ export: true });

const apiKey = Deno.env.get("TYPESAFE_API_KEY");
if (!apiKey) {
  throw new Error(
    "TYPESAFE_API_KEY is not set. Add it to a .env file at the repo root, or export it in your shell. See README.md.",
  );
}

// Optional extra headers sent with every request, as a JSON object of strings.
function parseHeaders(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};
  const invalid = new Error(
    `TYPESAFE_HEADERS must be a JSON object of string values, for example '{"Header-Name":"value"}'. See README.md.`,
  );
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw invalid;
  }
  if (
    typeof parsed !== "object" || parsed === null || Array.isArray(parsed) ||
    !Object.values(parsed).every((value) => typeof value === "string")
  ) {
    throw invalid;
  }
  return parsed as Record<string, string>;
}

const defaultHeaders = parseHeaders(Deno.env.get("TYPESAFE_HEADERS"));

export const client = new TypeSafeClient({ apiKey, defaultHeaders });
