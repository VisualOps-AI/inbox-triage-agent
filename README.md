# AI Inbox Triage Agent

A human-in-the-loop email triage workspace. Incoming messages are **classified** by an AI agent, a **draft reply is generated**, and every response is **routed to a human for approval before anything is sent**. Each decision is recorded in a complete audit trail.

Built to demonstrate a controlled agentic workflow: the agent does the work, a person stays in command, and nothing escapes review.

> **Status:** Demo with mock email data. Classification and drafting use deterministic placeholder logic designed to be swapped for a real LLM call (see [Extending](#extending)).

---

## Why this exists

Autonomous email responders are risky — a wrong reply to a lead, a client, or a billing dispute is hard to take back. This app models the safer pattern: **AI proposes, a human disposes.** Every AI action is logged with its confidence and timestamp, and no reply leaves the system without an explicit human approval.

---

## Features

- **Email ingestion** — eight mock messages spanning every category, including a deliberately mixed lead/billing case.
- **AI classification** into six labels: `lead`, `client_request`, `support`, `billing`, `spam`, `needs_review`.
- **Confidence scoring** — each classification carries a score; weak or ambiguous signals fall back to `needs_review`.
- **Draft reply generation** — a category-specific reply is drafted and queued for approval.
- **Approval dashboard** — Pending / Approved / Rejected tabs with one-click approve or reject.
- **Audit log** — every AI decision and human action is recorded with email ID, classification, confidence, generated reply, approval status, and timestamp.

---

## Screens

| Route | Purpose |
| --- | --- |
| `/` | Overview — counts, classification mix, and the end-to-end flow |
| `/inbox` | Review ingested emails, classify them, and generate drafts |
| `/approvals` | Approve or reject pending drafts (Pending / Approved / Rejected) |
| `/audit` | Full chronological trail of every decision |

> _Screenshots: drop images into `docs/` and reference them here, e.g. `![Inbox](docs/inbox.png)`._

---

## The workflow

```
Ingest ──▶ Classify ──▶ Generate draft ──▶ Human approval ──▶ Approved / Rejected
            (AI)            (AI)             (human gate)
   │           │              │                   │
   └───────────┴──────────────┴───────────────────┴──▶  Audit log (every step)
```

1. **Classify** an email (individually or *Classify all*) → records a classification + confidence.
2. **Generate draft** → produces a tailored reply and moves the item to **pending approval**.
3. **Approve & send** or **Reject** in the approval dashboard → nothing is sent without this step.
4. **Audit log** captures each transition with full context.

---

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4**
- **Zustand** for client-side state and the audit trail

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx          # Overview dashboard
│   ├── inbox/            # Email ingestion + classify + draft
│   ├── approvals/        # Approval dashboard (tabs + actions)
│   ├── audit/            # Audit log table
│   └── layout.tsx        # Shell + top navigation
├── components/
│   ├── nav.tsx           # Navigation with live pending badge
│   └── badges.tsx        # Classification / status / confidence UI
└── lib/
    ├── types.ts          # Domain models (Email, TriageRecord, AuditLogEntry)
    ├── mock-emails.ts    # Seed inbox
    ├── classifier.ts     # Keyword classifier + confidence scoring
    ├── draft.ts          # Template-based reply generator
    ├── store.ts          # Zustand store + audit logging
    └── format.ts         # Display helpers and badge styles
```

---

## Data model

Every AI decision is logged as an `AuditLogEntry`:

```ts
interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: "classified" | "reclassified" | "draft_generated" | "approved" | "rejected";
  emailId: string;
  classification: Classification | null;
  confidence: number | null;
  generatedReply: string | null;
  approvalStatus: "pending" | "approved" | "rejected" | null;
  summary: string;
}
```

State lives in memory for the session and is seeded from mock data. **Reset** restores the seed.

---

## Extending

The agentic steps are isolated behind small functions, so swapping in a real model is a localized change:

- **Classification** — replace `classifyEmail()` in `src/lib/classifier.ts` with an LLM call returning `{ classification, confidence }`.
- **Drafting** — replace `generateDraftReply()` in `src/lib/draft.ts` with a prompt-driven generation call.
- **Ingestion** — swap `src/lib/mock-emails.ts` for the Gmail API.
- **Persistence** — add `zustand/persist` (with a hydration guard) or a database to keep the audit trail across sessions.

---

## License

MIT
