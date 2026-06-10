"use client";

import { useState } from "react";
import Link from "next/link";
import { ClassificationBadge, ConfidenceBar } from "@/components/badges";
import { formatTimestamp } from "@/lib/format";
import { useInboxStore } from "@/lib/store";
import type { ApprovalStatus, EmailMessage, TriageRecord } from "@/lib/types";

type Tab = ApprovalStatus;

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function ApprovalsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const emails = useInboxStore((state) => state.emails);
  const records = useInboxStore((state) => state.records);

  const emailById = new Map(emails.map((email) => [email.id, email]));
  const counts: Record<Tab, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const record of Object.values(records)) {
    if (record.approvalStatus) counts[record.approvalStatus] += 1;
  }

  const visible = Object.values(records)
    .filter((record) => record.approvalStatus === tab)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Approval Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nothing is sent automatically. A human approves or rejects every AI
          draft.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === item.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
            <span
              className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                tab === item.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {counts[item.id]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="space-y-4">
          {visible.map((record) => {
            const email = emailById.get(record.emailId);
            if (!email) return null;
            return (
              <ApprovalCard key={record.emailId} email={email} record={record} />
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const copy: Record<Tab, string> = {
    pending:
      "No drafts are waiting. Generate a draft from the inbox to queue it here.",
    approved: "No approved replies yet.",
    rejected: "No rejected replies yet.",
  };
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <p className="text-sm text-slate-500">{copy[tab]}</p>
      <Link
        href="/inbox"
        className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        Go to inbox →
      </Link>
    </div>
  );
}

function ApprovalCard({
  email,
  record,
}: {
  email: EmailMessage;
  record: TriageRecord;
}) {
  const approve = useInboxStore((state) => state.approve);
  const reject = useInboxStore((state) => state.reject);
  const isPending = record.approvalStatus === "pending";

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <h2 className="truncate font-medium text-slate-800">
            {email.subject}
          </h2>
          <p className="text-xs text-slate-400">
            {email.fromName} · {email.fromAddress} ·{" "}
            {formatTimestamp(record.updatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {record.classification && (
            <ClassificationBadge value={record.classification} />
          )}
          {record.confidence !== null && (
            <ConfidenceBar value={record.confidence} />
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Proposed reply
        </p>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {record.generatedReply}
        </p>
      </div>

      {isPending && (
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
          <button
            onClick={() => reject(email.id)}
            className="rounded-md border border-rose-200 bg-white px-4 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            Reject
          </button>
          <button
            onClick={() => approve(email.id)}
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Approve & send
          </button>
        </div>
      )}
    </article>
  );
}
