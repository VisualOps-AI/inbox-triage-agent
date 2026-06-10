import {
  CLASSIFICATION_STYLES,
  STATUS_LABELS,
  STATUS_STYLES,
} from "@/lib/format";
import {
  CLASSIFICATION_LABELS,
  type ApprovalStatus,
  type Classification,
} from "@/lib/types";

const PILL =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";

export function ClassificationBadge({ value }: { value: Classification }) {
  return (
    <span className={`${PILL} ${CLASSIFICATION_STYLES[value]}`}>
      {CLASSIFICATION_LABELS[value]}
    </span>
  );
}

export function StatusBadge({ value }: { value: ApprovalStatus }) {
  return (
    <span className={`${PILL} ${STATUS_STYLES[value]}`}>
      {STATUS_LABELS[value]}
    </span>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  const tone =
    percent >= 75
      ? "bg-emerald-500"
      : percent >= 50
        ? "bg-amber-500"
        : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-slate-500">{percent}%</span>
    </div>
  );
}
