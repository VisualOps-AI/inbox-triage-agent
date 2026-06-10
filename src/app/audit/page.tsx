"use client";

import { ClassificationBadge, StatusBadge } from "@/components/badges";
import { EVENT_LABELS, formatConfidence, formatTimestamp } from "@/lib/format";
import { useInboxStore } from "@/lib/store";

export default function AuditPage() {
  const auditLog = useInboxStore((state) => state.auditLog);
  const emails = useInboxStore((state) => state.emails);
  const subjectById = new Map(emails.map((email) => [email.id, email.subject]));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Audit Log</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every AI decision and human action is recorded with full context.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {auditLog.length} {auditLog.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {auditLog.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">
            No activity yet. Classify an email or generate a draft to start the
            trail.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Classification</th>
                <th className="px-4 py-3 font-medium">Confidence</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLog.map((entry) => (
                <tr key={entry.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500 tabular-nums">
                    {formatTimestamp(entry.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">
                      {EVENT_LABELS[entry.event]}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <span className="block truncate text-slate-700">
                      {subjectById.get(entry.emailId) ?? entry.emailId}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {entry.emailId}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {entry.classification ? (
                      <ClassificationBadge value={entry.classification} />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">
                    {formatConfidence(entry.confidence)}
                  </td>
                  <td className="px-4 py-3">
                    {entry.approvalStatus ? (
                      <StatusBadge value={entry.approvalStatus} />
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
