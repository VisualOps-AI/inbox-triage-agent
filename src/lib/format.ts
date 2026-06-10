import type {
  ApprovalStatus,
  AuditEvent,
  Classification,
} from "./types";

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatConfidence(confidence: number | null): string {
  if (confidence === null) return "—";
  return `${Math.round(confidence * 100)}%`;
}

export const CLASSIFICATION_STYLES: Record<Classification, string> = {
  lead: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  client_request: "bg-blue-50 text-blue-700 ring-blue-600/20",
  support: "bg-amber-50 text-amber-700 ring-amber-600/20",
  billing: "bg-violet-50 text-violet-700 ring-violet-600/20",
  spam: "bg-rose-50 text-rose-700 ring-rose-600/20",
  needs_review: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export const STATUS_STYLES: Record<ApprovalStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export const STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const EVENT_LABELS: Record<AuditEvent, string> = {
  classified: "Classified",
  reclassified: "Reclassified",
  draft_generated: "Draft generated",
  approved: "Approved",
  rejected: "Rejected",
};
