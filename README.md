# rn Monorepo

Large product monorepo containing app surfaces, demos, shared UI packages, and API/docs artifacts.

## Repository Structure

- `apps/` - production-oriented applications (React Native, Ionic/React, and related app surfaces)
- `packages/` - shared libraries, UI systems, and reusable modules
- `demos/` - startup/demo projects and prototypes
- `docs/` - API and architecture documentation
- `.github/` - CI, governance workflows, PR templates, and CODEOWNERS

## Engineering Standards (Do / Don’t)

### Do

- Use `pnpm` from the repository root.
- Use descriptive branches that match the naming policy.
- Use Conventional Commit-style PR titles.
- Run lint/typecheck/test/build locally before requesting review.
- Keep PRs focused and easy to review.
- Document breaking changes and migration steps in the PR.

### Don’t

- Don’t commit secrets or credentials.
- Don’t bypass required CI checks.
- Don’t open PRs without context, testing notes, or ticket linkage.
- Don’t mix unrelated changes in one PR.
- Don’t use ad hoc package managers inside workspace subfolders.

## CI / PR Governance

The repository enforces:

- Branch naming rules (`feature/*`, `fix/*`, `hotfix/*`, etc.)
- Conventional Commit PR titles (`feat:`, `fix:`, etc.)
- PR quality checks (lint/typecheck/test/build if scripts exist)
- Security checks (CodeQL, dependency review, package audit)
- CODEOWNERS-based review routing

See:

- `CONTRIBUTING.md`
- `.github/pull_request_template.md`
- `.github/CODEOWNERS`
- `.github/workflows/`

## Quick Start

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If a script is not defined at root, run the relevant package/app-level equivalent before opening a PR.
