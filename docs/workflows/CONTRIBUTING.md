# Contributing

> **Last Updated:** 2026-01-05  
> **Canonical Status:** Canonical  
> **Purpose:** Development workflow and contribution guidelines  
> **See Also:** [SETUP.md](./SETUP.md), [DOCS_INDEX.md](../DOCS_INDEX.md)

## Development Workflow
1. Create feature branch from `main`: `git checkout -b feature/your-feature-name`
2. Make changes following code style (Prettier + ESLint)
3. Add or update tests as needed
4. Update documentation if applicable
5. Submit pull request with clear description

## Code Standards
- Follow Prettier formatting (runs automatically on commit)
- Pass all ESLint rules (TypeScript + React best practices)
- Document components with JSDoc comments
- Keep commits focused and atomic
- Write meaningful commit messages using Conventional Commits format

## Pull Request Requirements
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Documentation updated for user-facing changes
- [ ] Lighthouse scores remain >90 for affected pages

## Commit Message Format
Use Conventional Commits format:
```
type(scope): description

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(homepage): add testimonials section
fix(contact): resolve form validation issue
docs(readme): update installation instructions
```

## Testing
```bash
# Run test suite
npm test

# Run coverage (writes to coverage/)
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Format code
npm run format:check
npm run format
```

**E2E prerequisites**
- Install Playwright browsers once before running `npm run test:e2e`:
  - Preferred: `npx playwright install --with-deps`
  - Minimal (if system deps already present): `npx playwright install`
- If registry or network access is restricted, rerun the install when connectivity is available so the browsers download correctly.

**Coverage guidance**
- Requires the dev dependency `@vitest/coverage-v8`
- If missing, install with `npm install -D @vitest/coverage-v8` before running coverage
- Coverage reports are written to `coverage/` (open `coverage/index.html` for HTML output)
- `npm run test:coverage` fails fast with guidance if the provider is missing (see `DEPENDENCY_HEALTH.md` for current registry status)

## Before Submitting PR
1. Rebase on latest `main`
2. Run all checks: `npm run format:check && npm run lint && npm run type-check && npm test`
3. Test production build: `npm run build && npm run start`
4. Write clear PR description

## Questions?
Open an issue for bugs or feature requests.
