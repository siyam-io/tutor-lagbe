# Agent Instructions

> This file is the **source of truth** for all AI coding agents working on this project.
> Tool-specific adapters in `adapters/` read from this file. Do not duplicate instructions there.

## Project Overview

project: tutor-lagbe
stack: Next.js 15 (App Router), React 19, TypeScript, Node.js, Express, Prisma ORM, PostgreSQL, Tailwind CSS
description: Tutor Lagbe - A full-stack tutoring platform matching students and tutors.

## Build Commands

```
frontend dev:  npm --prefix frontend run dev
backend dev:   npm --prefix backend run dev
build:        npm --prefix frontend run build && npm --prefix backend run build
prisma:       npm --prefix backend run prisma:generate
```

## Coding Conventions

- Language: TypeScript
- Frontend Framework: Next.js 15 App Router
- Backend Framework: Express.js
- Database & ORM: PostgreSQL with Prisma ORM
- Styling: Tailwind CSS
- Formatting: Prettier / ESLint

## File Structure Rules

```
frontend/  → Next.js 15 App Router frontend application
backend/   → Express.js API backend and Prisma schema/migrations
shared/    → Shared TypeScript types and utilities
docs/      → Documentation
```

## Boundaries

```
no-touch:
  - .env
  - .env.*
  - backend/.env
  - frontend/.env.local
  - node_modules/
  - package-lock.json (do not manually edit)
```

## Agent Roles

| Role | Tool | Scope | Permissions |
|------|------|-------|-------------|
| default | any | all files | read + write |

## Dependencies

- next, react, typescript
- express, @prisma/client, jsonwebtoken, bcryptjs, zod
- tailwindcss, lucide-react

## Testing Strategy

- Type checking: TypeScript (`tsc --noEmit`)


## Additional Context

- See `MEMORY.md` for project history and decisions
- See `TASKS.md` for current work items
- See `RUNBOOK.md` for operational procedures