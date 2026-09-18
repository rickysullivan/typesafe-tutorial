# AGENTS.md

## Agent skills

### Issue tracker

Issues and specs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root, created lazily as terms/decisions resolve. See `docs/agents/domain.md`.

## Commit conventions

Commit using [Conventional Commits](https://www.conventionalcommits.org/) as you go — don't batch unrelated work into one commit. Format: `type(scope): subject`, imperative mood, scope optional when the change is repo-wide.

Common types here: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`. Each commit should be a single logical unit of work someone could review or revert on its own.
