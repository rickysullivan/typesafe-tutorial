# Contributing

How this repo is put together, and what to follow when you add a lesson or cookbook. For setup and the table of contents, see the [README](README.md).

## Notebook format

Lessons and cookbooks are Jupyter notebooks (`.ipynb`) running on the Deno kernel, not HTML. Notebooks keep the narrative, the runnable code and the saved output in one file.

Install the kernel with `deno jupyter --install`. Open notebooks in VS Code with the Jupyter extension.

Every notebook imports the shared client from `assets/typesafe-client.ts`. Adjust the relative path to match the notebook's depth, for example `../../assets/typesafe-client.ts` from `lessons/core-concepts/`.

The shared client sends any headers set in `TYPESAFE_HEADERS` (see the README) with every request. To send a header on one request only, pass it per call instead: `client.systemOne({ ... }, { headers: { "Header-Name": "value" } })`.

The shared module also exports `systemOneRaw`, which calls the HTTP API directly. Use it only for API features the SDK doesn't support yet, such as images and Box in lesson 10, and move back to `client.systemOne` once the SDK catches up.

## Where things go

### Lessons

- `lessons/core-concepts/` holds the fundamentals. `lessons/patterns/` holds the architectural patterns that docs.typesafe.ai lists under `/patterns`. The split mirrors `GLOSSARY.md`.
- Lessons are numbered, and the numbers are global across both folders. A number is a position in the overall sequence, not a position within a folder.
- File names look like `0006-speculative-fan-out.ipynb`.

### Cookbooks

- Cookbooks live under `cookbooks/`, one subfolder per docs.typesafe.ai cookbook category. `integrations/` is for cookbooks original to this repo that pair TypeSafe with an external framework.
- Cookbooks are not a sequence. Name them by slug (`function-calling.ipynb`) with no number.
- Cookbooks never say "lesson N covered...". Refer to a lesson by file path, for example `lessons/patterns/0006-speculative-fan-out.ipynb`, because a cookbook has no fixed place in the sequence.
- Put `**Difficulty:** Beginner`, `Intermediate` or `Advanced` directly under the title. For the docs.typesafe.ai categories, copy the tag from the docs sidebar. For `integrations/`, use your judgement.

## Writing a lesson or cookbook

### Check for understanding: predict, then run

After a runnable cell, ask the reader to change one input and predict the answer before they re-run it. Use this format in every lesson and cookbook.

### Embed the primary source

Right after the intro cell, add a collapsed `<details><summary>` block with the text of the docs page the notebook is built from. Don't link out instead, and don't mention the block in the prose.

- Convert relative doc links to absolute `https://docs.typesafe.ai/...` links, without the `.md` suffix. The suffix returns raw markdown rather than the rendered page.
- Convert Mintlify JSX such as `<Note>...</Note>` to plain markdown blockquotes. Raw MDX doesn't render in Jupyter or on GitHub.
- Keep the lesson's own prose compressed. Don't quote the same sentence in both places.

### Sourcing

Every technical claim must trace to [docs.typesafe.ai](https://docs.typesafe.ai/) or to TypeSafe's own `typesafe:typesafe-ai` Claude Code skill. Don't rely on the marketing site. If the sources disagree, say so in the lesson.

Cookbooks in `integrations/` cite the external framework's own docs instead.

## When you add, move or renumber a notebook

1. Update the **Contents** section of the [README](README.md). It is a manual list and doesn't update itself.
2. Run `deno check` on every cell you touched. Don't just eyeball the import path or the "lesson N" cross-references in the prose.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`, imperative mood. Make each commit one logical unit of work. See `AGENTS.md`.
