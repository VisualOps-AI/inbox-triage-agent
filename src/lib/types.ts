export const CLASSIFICATIONS = [
  "lead",
  "client_request",
  "support",
  "billing",
  "spam",
  "needs_review",
] as const;

export type Classification = (typeof CLASSIFICATIONS)[number];

export const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export type TriageStage =
  | "new"
  | "classified"
  | "drafted"
  | "approved"
  | "rejected";

export interface EmailMessage {
  id: string;
  fromName: string;
  fromAddress: string;
  subject: string;
  body: string;
  receivedAt: string;
}

export interface TriageRecord {
  emailId: string;
  stage: TriageStage;
  classification: Classification | null;
  confidence: number | null;
  generatedReply: string | null;
  approvalStatus: ApprovalStatus | null;
  updatedAt: string;
}

export type AuditEvent =
  | "classified"
  | "reclassified"
  | "draft_generated"
  | "approved"
  | "rejected";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: AuditEvent;
  emailId: string;
  classification: Classification | null;
  confidence: number | null;
  generatedReply: string | null;
  approvalStatus: ApprovalStatus | null;
  summary: string;
}

export const CLASSIFICATION_LABELS: Record<Classification, string> = {
  lead: "Lead",
  client_request: "Client Request",
  support: "Support",
  billing: "Billing",
  spam: "Spam",
  needs_review: "Needs Review",
};
