import type { Classification, EmailMessage } from "./types";

interface Rule {
  label: Exclude<Classification, "needs_review">;
  keywords: string[];
}

const RULES: Rule[] = [
  {
    label: "spam",
    keywords: [
      "congratulations",
      "winner",
      "gift card",
      "free",
      "click here",
      "act fast",
      "limited time",
      "100% guaranteed",
      "urgent",
      "claim",
    ],
  },
  {
    label: "billing",
    keywords: [
      "invoice",
      "payment",
      "charged",
      "charge",
      "card was declined",
      "refund",
      "billing",
      "receipt",
      "subscription",
      "overcharged",
    ],
  },
  {
    label: "support",
    keywords: [
      "crash",
      "crashing",
      "bug",
      "error",
      "not working",
      "freezes",
      "issue",
      "help",
      "broken",
      "can't",
      "cannot",
      "blocking",
    ],
  },
  {
    label: "lead",
    keywords: [
      "demo",
      "pricing",
      "interested",
      "quote",
      "evaluating",
      "learn more",
      "book a call",
      "proposal",
      "trial",
      "plans",
    ],
  },
  {
    label: "client_request",
    keywords: [
      "as discussed",
      "our last call",
      "change",
      "adjust",
      "next steps",
      "finalize",
      "deliverable",
      "scope",
      "revision",
      "update the",
    ],
  },
];

export interface ClassificationResult {
  classification: Classification;
  confidence: number;
}

function countHits(haystack: string, keywords: string[]): number {
  return keywords.reduce(
    (count, keyword) => (haystack.includes(keyword) ? count + 1 : count),
    0,
  );
}

export function classifyEmail(email: EmailMessage): ClassificationResult {
  const haystack = `${email.subject}\n${email.body}`.toLowerCase();

  let best: { label: Classification; hits: number } = {
    label: "needs_review",
    hits: 0,
  };
  let runnerUpHits = 0;

  for (const rule of RULES) {
    const hits = countHits(haystack, rule.keywords);
    if (hits > best.hits) {
      runnerUpHits = best.hits;
      best = { label: rule.label, hits };
    } else if (hits > runnerUpHits) {
      runnerUpHits = hits;
    }
  }

  if (best.hits === 0) {
    return { classification: "needs_review", confidence: 0.35 };
  }

  const separation = best.hits - runnerUpHits;
  const ambiguous = best.hits > 0 && runnerUpHits >= best.hits;

  if (ambiguous) {
    return { classification: "needs_review", confidence: 0.45 };
  }

  const raw = 0.55 + best.hits * 0.12 + separation * 0.05;
  const confidence = Math.min(0.97, Number(raw.toFixed(2)));

  return { classification: best.label, confidence };
}
