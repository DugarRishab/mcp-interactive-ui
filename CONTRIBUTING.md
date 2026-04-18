# Contributing

## Prerequisites

- Node ≥ 18
- pnpm ≥ 9

## Setup

```bash
pnpm install
pnpm build
pnpm test
```

Everything must be green.

## Workflow

1. Branch from `main`.
2. Make your change, including tests.
3. Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build` locally.
4. Run `pnpm changeset` and describe the user-visible change. Choose `patch` / `minor` / `major` per semver — Phase 1 is `0.1.x`, so breaking changes go as `minor` until we hit `1.0`.
5. Open a PR.

## Code style

- No `any` in public APIs. Use `unknown` and narrow.
- Do not add or remove comments unless asked — the repo deliberately keeps comment density low.
- Prettier + ESLint are enforced in CI. Run `pnpm lint --fix` locally.

## Adding a block

See `docs/blocks.md`.
