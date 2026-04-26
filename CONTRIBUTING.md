# Contributing Guide

Thanks for contributing to this monorepo. This document explains what to do, what not to do, and what CI enforces.

## Branching Strategy

- Target branch is usually `master` (or `main`/`develop`/`staging` when those flows are used).
- Keep branches short-lived and focused on one concern.
- Sync with the target base branch regularly to reduce conflicts.

## Branch Name Rules

Use this format:

`<type>/<kebab-case-description>`

Allowed `<type>` values:

- `feature`
- `fix`
- `hotfix`
- `release`
- `chore`
- `docs`
- `refactor`
- `test`
- `ci`

Examples:

- `feature/pos-receipt-sharing`
- `fix/reservation-date-picker-crash`
- `chore/update-eslint-config`

## PR Title Rules

PR titles must follow Conventional Commits:

- `type(scope): description`
- `type: description`

Allowed `type` values:

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

Examples:

- `feat(pos-app): add split payment modal`
- `fix(reservation-app): handle timezone conversion safely`

## Required Quality Gates

GitHub Actions checks for:

- Branch naming policy
- PR title policy
- Security checks (CodeQL, dependency review, package audit)
- Quality scripts when present in root `package.json`:
  - `lint`
  - `typecheck`
  - `test`
  - `build`

## Do and Don’t

### Do

- Use `pnpm` from the repository root.
- Keep PRs small and reviewable.
- Fill out the PR template completely.
- Add or update tests when behavior changes.
- Update docs when changing APIs, flows, or setup.
- Follow CODEOWNERS review paths.

### Don’t

- Don’t commit secrets, tokens, or private keys.
- Don’t bypass CI or merge with failing required checks.
- Don’t force-push shared long-lived branches.
- Don’t install dependencies ad hoc with `npm` or `yarn` in subfolders.
- Don’t mix unrelated refactors into feature/bugfix PRs.

## Local Verification

Run from workspace root:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If `test` is not defined at root, run the relevant app/package tests directly before opening a PR.

## Monorepo Rules

- Package manager: `pnpm` (workspace-managed).
- Install dependencies only from workspace root.
- Prefer workspace-aware scripts (Nx targets and root scripts) over ad hoc per-package commands.
