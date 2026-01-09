# SECURITY.md

Last Updated: 2026-01-06

## Supported versions
This repository is a template framework. When used in a real project, define supported release lines here.

## Reporting a vulnerability
If this repo is deployed/used in production, define a private reporting channel (email or ticket system) and response SLA.

## Security principles (baseline)
- Never commit secrets. Use environment variables, `.env` (gitignored), or a secret manager.
- Least privilege for credentials and tokens.
- Prefer dependency pinning and automated updates in CI.
- Treat AI-generated code as untrusted until verified (tests + review).
- Contact form includes a hidden honeypot field; submissions are rejected if it is filled.

## Quick checks
- Run: `make ci`
- Review: `docs/SECURITY_BASELINE.md`
