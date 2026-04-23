# Contributing Guide

## Branching Strategy

- Base branch: `master`
- Keep branches short-lived and focused on one concern.
- Rebase or merge `master` regularly to reduce conflicts.

## Branch Name Rules

Use this format:

`<type>/<kebab-case-description>`

Allowed `<type>` values:

- `feat`
- `fix`
- `chore`
- `docs`
- `refactor`
- `test`
- `ci`
- `build`
- `perf`
- `revert`
- `hotfix`

Examples:

- `feat/pos-receipt-sharing`
- `fix/reservation-date-picker-crash`
- `chore/update-eslint-config`

## Pull Request Rules

- PR title must follow Conventional Commits:
  - `type(scope): description`
  - `type: description`
- Minimum description length in title body after colon is 10 characters.
- Draft PRs are allowed; quality checks run when PR is marked ready.

Examples:

- `feat(pos-app): add split payment modal`
- `fix(reservation-app): handle timezone conversion safely`

## Required Quality Gates

The PR workflow enforces:

- Branch naming policy
- PR title policy
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

## Local Verification

Run from workspace root:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm build
```

## Monorepo Package Manager Rules

- Use `pnpm` only.
- Install dependencies only from workspace root.
- Do not run `npm install` in app/package folders.
