# package manager instructions

Always use `bun` instead of `npm` for all package management commands:
For every changes, run the following scripts:
1. `bun ts:check yourfile.ts` to check if everything is working without error. Specify only files you are working on.
2. `bun lint`

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five canonical label names. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: one `CONTEXT.md` at the repo root, ADRs in `docs/adr/`. See `docs/agents/domain.md`.

# shadcn instructions

Use the latest version of Shadcn to install new components, like this command to add a button component:

```bash
bunx shadcn@latest add button
```
