"use client";

import Link from "next/link";
import { ClassificationBadge } from "@/components/badges";
import { useInboxStore } from "@/lib/store";
import { CLASSIFICATIONS, type TriageRecord } from "@/lib/types";

export default function OverviewPage() {
  const emails = useInboxStore((state) => state.emails);
  const records = useInboxStore((state) => state.records);
  const auditLog = useInboxStore((state) => state.auditLog);

  const all = Object.values(records);
  const classified = all.filter((r) => r.classification !== null).length;
  const pending = countBy(all, "pending");
  const approved = countBy(all, "approved");
  const rejected = countBy(all, "rejected");

  const distribution = CLASSIFICATIONS.map((label) => ({
    label,
    count: all.filter((r) => r.classification === label).length,
  })).filter((item) => item.count > 0);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">
          AI Inbox Triage
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Incoming email is classified by an AI agent, a draft reply is
          generated, and every response is routed to a human for approval before
          anything is sent. Each decision is logged with its confidence score
          and timestamp.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Emails" value={emails.length} />
        <Stat label="Classified" value={classified} />
        <Stat label="Pending" value={pending} tone="amber" />
        <Stat label="Approved" value={approved} tone="emerald" />
        <Stat label="Rejected" value={rejected} tone="rose" />
        <Stat label="Audit entries" value={auditLog.length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Classification mix
          </h2>
          {distribution.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              Nothing classified yet. Head to the inbox and classify your
              messages.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {distribution.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <div className="w-32 shrink-0">
                    <ClassificationBadge value={item.label} />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-800"
                      style={{
                        width: `${(item.count / emails.length) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm tabular-nums text-slate-600">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">How it works</h2>
          <ol className="mt-4 space-y-3 text-sm text-slate-600">
            <Step n={1} href="/inbox" cta="Open inbox">
              Review ingested mock emails and classify each into one of six
              categories.
            </Step>
            <Step n={2} href="/inbox" cta="Generate drafts">
              The agent drafts a reply tailored to the classification.
            </Step>
            <Step n={3} href="/approvals" cta="Approve or reject">
              A human signs off on every draft. Nothing sends without approval.
            </Step>
            <Step n={4} href="/audit" cta="View audit log">
              Inspect the full trail of decisions, confidence, and timestamps.
            </Step>
          </ol>
        </div>
      </section>
    </div>
  );
}

function countBy(records: TriageRecord[], status: TriageRecord["approvalStatus"]) {
  return records.filter((record) => record.approvalStatus === status).length;
}

const TONES = {
  slate: "text-slate-900",
  amber: "text-amber-600",
  emerald: "text-emerald-600",
  rose: "text-rose-600",
} as const;

function Stat({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: keyof typeof TONES;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className={`text-2xl font-semibold tabular-nums ${TONES[tone]}`}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

function Step({
  n,
  href,
  cta,
  children,
}: {
  n: number;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
        {n}
      </span>
      <div>
        <p>{children}</p>
        <Link
          href={href}
          className="mt-1 inline-block text-xs font-medium text-blue-600 hover:text-blue-500"
        >
          {cta} →
        </Link>
      </div>
    </li>
  );
}
