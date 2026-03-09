"use client";

import { useState, useEffect, useCallback } from "react";
import { SummaryCards } from "./SummaryCards";
import { RunsTable } from "./RunsTable";
import type { TestRun } from "@/db/schema";

const PAGE_SIZE = 10;

export function DashboardContent({
  initialRuns,
  initialTotal,
}: {
  initialRuns: TestRun[];
  initialTotal: number;
}) {
  const [runs, setRuns] = useState<TestRun[]>(initialRuns);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(0);
  const latestRun = page === 0 ? runs[0] || null : null;
  const hasRunning = runs.some((r) => r.status === "running");
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const fetchRuns = useCallback(
    async (p: number) => {
      try {
        const res = await fetch(
          `/api/runs?limit=${PAGE_SIZE}&offset=${p * PAGE_SIZE}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setRuns(data.runs);
        setTotal(data.total);
      } catch {
        // ignore
      }
    },
    []
  );

  // 페이지 변경 시 데이터 fetch
  useEffect(() => {
    if (page === 0) return; // 첫 페이지는 initialRuns 사용
    fetchRuns(page);
  }, [page, fetchRuns]);

  // running 상태가 있을 때만 5초 폴링
  useEffect(() => {
    if (!hasRunning) return;
    const interval = setInterval(() => fetchRuns(page), 5000);
    return () => clearInterval(interval);
  }, [hasRunning, page, fetchRuns]);

  function goToPage(p: number) {
    if (p < 0 || p >= totalPages) return;
    setPage(p);
    if (p === 0) fetchRuns(0); // 첫 페이지로 돌아올 때도 최신 데이터
  }

  return (
    <>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            최근 실행 요약
          </h2>
          {hasRunning && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              실행 중
            </span>
          )}
        </div>
        <SummaryCards latestRun={latestRun} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            실행 히스토리
          </h2>
          <span className="text-xs text-[var(--muted)]">
            총 {total}건
          </span>
        </div>
        <RunsTable runs={runs} />

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i)
              .filter(
                (i) =>
                  i === 0 ||
                  i === totalPages - 1 ||
                  Math.abs(i - page) <= 1
              )
              .reduce<(number | "...")[]>((acc, i, idx, arr) => {
                if (idx > 0 && i - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(i);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-xs text-[var(--muted)]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item as number)}
                    className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      page === item
                        ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                        : "text-[var(--muted)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {(item as number) + 1}
                  </button>
                )
              )}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
            >
              다음
            </button>
          </div>
        )}
      </section>
    </>
  );
}
