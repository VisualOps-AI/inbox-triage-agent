"use client";

import Link from "next/link";
import { ClassificationBadge, ConfidenceBar, StatusBadge } from "@/components/badges";
import { formatTimestamp } from "@/lib/format";
import { useInboxStore } from "@/lib/store";
import type { EmailMessage, TriageRecord } from "@/lib/types";

export default function InboxPage() {
  const emails = useInboxStore((state) => state.emails);
  const records = useInboxStore((state) => state.records);
  const classifyAll = useInboxStore((state) => state.classifyAll);
  const reset = useInboxStore((state) => state.reset);

  const unclassified = emails.filter(
    (email) => records[email.id]?.classification === null,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Inbox</h1>
          <p className="mt-1 text-sm text-slate-500">
            {emails.length} ingested messages. Classify each one, then generate a
            draft reply for human approval.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={classifyAll}
            disabled={unclassified === 0}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Classify all{unclassified > 0 ? ` (${unclassified})` : ""}
          </button>
          <button
            onClick={reset}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            record={records[email.id]}
          />
        ))}
      </div>
    </div>
  );
}

function EmailCard({
  email,
  record,
}: {
  email: EmailMessage;
  record: TriageRecord;
}) {
  const classify = useInboxStore((state) => state.classify);
  const generateDraft = useInboxStore((state) => state.generateDraft);

  const isClassified = record.classification !== null;
  const hasDraft = record.generatedReply !== null;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-900">{email.fromName}</span>
            <span className="truncate text-sm text-slate-400">
              {email.fromAddress}
            </span>
            <span className="text-xs text-slate-400">
              · {formatTimestamp(email.receivedAt)}
            </span>
          </div>
          <h2 className="mt-1 font-medium text-slate-800">{email.subject}</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {email.body}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          {isClassified && record.classification ? (
            <>
              <ClassificationBadge value={record.classification} />
              {record.confidence !== null && (
                <ConfidenceBar value={record.confidence} />
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400">Not yet classified</span>
          )}
          {record.approvalStatus && (
            <StatusBadge value={record.approvalStatus} />
          )}
        </div>
      </div>

      {hasDraft && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Generated draft reply
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {record.generatedReply}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => classify(email.id)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {isClassified ? "Re-classify" : "Classify"}
          </button>
          <button
            onClick={() => generateDraft(email.id)}
            disabled={!isClassified}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {hasDraft ? "Regenerate draft" : "Generate draft"}
          </button>
        </div>
        {record.approvalStatus === "pending" && (
          <Link
            href="/approvals"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Review in approvals →
          </Link>
        )}
      </div>
    </article>
  );
}
