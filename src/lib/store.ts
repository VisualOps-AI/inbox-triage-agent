import { create } from "zustand";
import { classifyEmail } from "./classifier";
import { generateDraftReply } from "./draft";
import { MOCK_EMAILS } from "./mock-emails";
import {
  CLASSIFICATION_LABELS,
  type AuditEvent,
  type AuditLogEntry,
  type EmailMessage,
  type TriageRecord,
} from "./types";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function initialRecords(emails: EmailMessage[]): Record<string, TriageRecord> {
  const records: Record<string, TriageRecord> = {};
  for (const email of emails) {
    records[email.id] = {
      emailId: email.id,
      stage: "new",
      classification: null,
      confidence: null,
      generatedReply: null,
      approvalStatus: null,
      updatedAt: email.receivedAt,
    };
  }
  return records;
}

interface InboxState {
  emails: EmailMessage[];
  records: Record<string, TriageRecord>;
  auditLog: AuditLogEntry[];
  classify: (emailId: string) => void;
  classifyAll: () => void;
  generateDraft: (emailId: string) => void;
  approve: (emailId: string) => void;
  reject: (emailId: string) => void;
  reset: () => void;
}

export const useInboxStore = create<InboxState>((set, get) => {
  function log(event: AuditEvent, record: TriageRecord, summary: string) {
    const entry: AuditLogEntry = {
      id: newId(),
      timestamp: new Date().toISOString(),
      event,
      emailId: record.emailId,
      classification: record.classification,
      confidence: record.confidence,
      generatedReply: record.generatedReply,
      approvalStatus: record.approvalStatus,
      summary,
    };
    set((state) => ({ auditLog: [entry, ...state.auditLog] }));
  }

  function updateRecord(emailId: string, patch: Partial<TriageRecord>) {
    const current = get().records[emailId];
    if (!current) return current;
    const next: TriageRecord = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ records: { ...state.records, [emailId]: next } }));
    return next;
  }

  return {
    emails: MOCK_EMAILS,
    records: initialRecords(MOCK_EMAILS),
    auditLog: [],

    classify: (emailId) => {
      const email = get().emails.find((item) => item.id === emailId);
      const record = get().records[emailId];
      if (!email || !record) return;

      const wasClassified = record.classification !== null;
      const { classification, confidence } = classifyEmail(email);
      const next = updateRecord(emailId, {
        classification,
        confidence,
        stage: record.stage === "new" ? "classified" : record.stage,
      });
      if (!next) return;

      const percent = Math.round(confidence * 100);
      log(
        wasClassified ? "reclassified" : "classified",
        next,
        `AI classified "${email.subject}" as ${CLASSIFICATION_LABELS[classification]} (${percent}% confidence).`,
      );
    },

    classifyAll: () => {
      for (const email of get().emails) {
        const record = get().records[email.id];
        if (record && record.classification === null) {
          get().classify(email.id);
        }
      }
    },

    generateDraft: (emailId) => {
      const email = get().emails.find((item) => item.id === emailId);
      const record = get().records[emailId];
      if (!email || !record || !record.classification) return;

      const reply = generateDraftReply(email, record.classification);
      const next = updateRecord(emailId, {
        generatedReply: reply,
        approvalStatus: "pending",
        stage: "drafted",
      });
      if (!next) return;

      log(
        "draft_generated",
        next,
        `AI drafted a reply for "${email.subject}" and queued it for human approval.`,
      );
    },

    approve: (emailId) => {
      const email = get().emails.find((item) => item.id === emailId);
      const record = get().records[emailId];
      if (!email || !record || record.approvalStatus !== "pending") return;

      const next = updateRecord(emailId, {
        approvalStatus: "approved",
        stage: "approved",
      });
      if (!next) return;

      log(
        "approved",
        next,
        `Human approved the reply for "${email.subject}". Cleared to send.`,
      );
    },

    reject: (emailId) => {
      const email = get().emails.find((item) => item.id === emailId);
      const record = get().records[emailId];
      if (!email || !record || record.approvalStatus !== "pending") return;

      const next = updateRecord(emailId, {
        approvalStatus: "rejected",
        stage: "rejected",
      });
      if (!next) return;

      log(
        "rejected",
        next,
        `Human rejected the reply for "${email.subject}". Nothing will be sent.`,
      );
    },

    reset: () => {
      set({
        records: initialRecords(MOCK_EMAILS),
        auditLog: [],
      });
    },
  };
});
