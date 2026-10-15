// Git clean filter: strips outputs and execution counts from a notebook on its way into the index.
// Registered by `deno task setup`; see .gitattributes. Reads the notebook on stdin, writes it to stdout.
//
// A notebook with nothing to strip is written back byte for byte, so committed notebooks keep their
// format. A stripped notebook is written as JSON with a one-space indent, which is how VS Code saves
// notebooks. Input that isn't a notebook is passed through unchanged: a filter must never block a commit.

type Cell = { cell_type?: string; outputs?: unknown[]; execution_count?: number | null };

const input = new Uint8Array(await new Response(Deno.stdin.readable).arrayBuffer());

function strip(bytes: Uint8Array): Uint8Array {
  let notebook: { cells?: Cell[] };
  try {
    notebook = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return bytes;
  }
  const cells = Array.isArray(notebook?.cells) ? notebook.cells : [];
  const code = cells.filter((cell) => cell.cell_type === "code");
  const hasRunData = code.some((cell) => (cell.outputs?.length ?? 0) > 0 || (cell.execution_count ?? null) !== null);
  if (!hasRunData) return bytes;

  for (const cell of code) {
    cell.outputs = [];
    cell.execution_count = null;
  }
  return new TextEncoder().encode(JSON.stringify(notebook, null, 1) + "\n");
}

await Deno.stdout.write(strip(input));
