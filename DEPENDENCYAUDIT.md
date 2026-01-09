# DEPENDENCYAUDIT.md — Dependency Audit (Health & Minimalism)

Document Type: Audit Runbook
Last Updated: 2026-01-05
Precedence: `CODEBASECONSTITUTION.md` → `READMEAI.md` → `TODO.md` → this document
Owner: AGENT

Purpose: Keep dependencies safe, minimal, and understandable for agents and future humans—without requiring paid CI.

## AGENT execution (runbook)
Inputs to inspect:
- `package.json (if present)`
- `lockfiles (package-lock.json / pnpm-lock.yaml / yarn.lock)`
- `Any runtime config that loads dependencies`
- `README / docs referencing deps`

Execution steps:
1) Inventory direct dependencies and classify: critical / convenience / likely-unused.
2) Flag high-risk deps: unmaintained, native binaries, broad transitive tree, security-sensitive surface (auth, crypto, payments).
3) For any proposed new dependency: list 2–3 alternatives (stdlib, existing deps, small custom code).
4) Create tasks for: removals, upgrades (with evidence), consolidation, and documentation updates (what the dependency is for).

Stop conditions:
- If you find a committed secret or a likely auth/payment vulnerability, stop and escalate via SECURITYAUDIT.md tasks (P0).
- If the repo has no dependency manifests, record that as UNKNOWN and stop.

Required outputs:
- Update/create tasks in TODO.md (Owner: AGENT or Trevor as appropriate).
- Append a run summary to this document.

## Task writing rules
- Tasks must be created/updated in `TODO.md` using the required schema.
- If a task is ambiguous, set **Status: BLOCKED** and add a question in the task Context.
- Do not invent repo facts. If evidence is missing, write **UNKNOWN** and cite what you checked.

---

## Summary (append-only)
> Append a dated summary after each run. Do not delete old summaries.

### 2026-01-06 — Summary
- Agent: AGENT (GitHub Copilot)
- Scope: package.json, lockfiles (package-lock.json not checked - not present), code usage
- Findings:
  - Critical dependencies: next@14.2.18, react@19.2.3, zod@4.3.5, @sentry/nextjs@10.32.1, @upstash/ratelimit@2.0.7, resend@6.6.0
  - All dependencies are actively maintained
  - Native binaries: sharp (acceptable for Next.js image optimization)
  - Large transitive trees: @sentry/nextjs (acceptable - observability is critical)
  - No unused dependencies identified
  - Dev dependencies appropriate for testing and build tooling
  - Total direct dependencies: 18 production + 19 dev = 37 (lean)
- Tasks created/updated:
  - None (dependencies are well-justified and minimal)
- Questions for Trevor:
  - (none)

### 2026-01-05 — Summary
- Agent: AGENT
- Scope: UNKNOWN (not yet run)
- Findings:
  - (none)
- Tasks created/updated:
  - (none)
- Questions for Trevor:
  - (none)

### 2026-01-07 — Summary
- Agent: GitHub Copilot
- Scope: package.json, npm audit
- Findings:
  - 🚨 **CRITICAL VULNERABILITY**: `next@15.5.2` has RCE/Source Exposure. Needs upgrade to `15.5.9+`.
  - ⚠️ High/Moderate vulnerabilities in `@cloudflare/next-on-pages` transitive tree (`path-to-regexp`, `esbuild`, `undici`).
  - ✅ Direct dependencies are otherwise minimal and justified.
  - ✅ Dev dependencies are standard.
- Tasks created/updated:
  - T-069: Update Next.js to fix critical vulnerabilities (P0, SECURITY)
  - T-070: Monitor and fix transitive build-tool vulnerabilities (P2, DEPENDENCY)
- Questions for Trevor:
  - (none)
