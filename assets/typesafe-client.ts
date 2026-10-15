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

// Calls POST /v1/systemone over plain HTTP, for API features the SDK doesn't
// support yet (images, Box). A FormData body is sent as multipart, anything
// else as JSON. Prefer `client.systemOne` whenever the SDK covers the feature.
export async function systemOneRaw(
  body: FormData | Record<string, unknown>,
  headers: Record<string, string> = {},
): Promise<unknown> {
  const isMultipart = body instanceof FormData;
  // Headers merges names case-insensitively; later set() calls win.
  const merged = new Headers(client.defaultHeaders);
  for (const [name, value] of Object.entries(headers)) merged.set(name, value);
  merged.set("Authorization", `Bearer ${apiKey}`);
  merged.set("Accept", "application/json");
  // fetch sets the multipart Content-Type itself, boundary included.
  if (isMultipart) merged.delete("Content-Type");
  else merged.set("Content-Type", "application/json");
  const response = await fetch(`${client.baseURL}/v1/systemone`, {
    method: "POST",
    headers: merged,
    body: isMultipart ? body : JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`TypeSafe API returned ${response.status}: ${text}`);
  }
  return JSON.parse(text);
}
