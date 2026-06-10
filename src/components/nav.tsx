"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInboxStore } from "@/lib/store";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/inbox", label: "Inbox" },
  { href: "/approvals", label: "Approvals" },
  { href: "/audit", label: "Audit Log" },
];

export function Nav() {
  const pathname = usePathname();
  const pendingCount = useInboxStore(
    (state) =>
      Object.values(state.records).filter(
        (record) => record.approvalStatus === "pending",
      ).length,
  );

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            IT
          </span>
          <span className="text-sm font-semibold text-slate-900">
            Inbox Triage Agent
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
                {link.href === "/approvals" && pendingCount > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
