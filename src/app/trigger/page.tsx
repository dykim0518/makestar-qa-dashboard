"use client";

import { useState } from "react";
import Link from "next/link";

const SUITES = [
  { value: "cmr", label: "CMR (Makestar)", desc: "메인 사이트 모니터링" },
  { value: "albumbuddy", label: "AlbumBuddy", desc: "구매 대행 모니터링" },
  { value: "admin", label: "Admin", desc: "관리자 페이지 (VPN 필요)", warn: true },
  { value: "all", label: "All", desc: "전체 실행 (admin 제외)" },
];

export default function TriggerPage() {
  const [suite, setSuite] = useState("cmr");
  const [project, setProject] = useState("");
  const [spec, setSpec] = useState("");
  const [grep, setGrep] = useState("");
  const [retries, setRetries] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    message?: string;
    error?: string;
    actionsUrl?: string;
  } | null>(null);

  const selectedSuite = SUITES.find((s) => s.value === suite);

  async function handleTrigger() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suite, project, spec, grep, retries }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: "네트워크 오류" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--card-border)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <Link href="/dashboard" className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
              Makestar QA Dashboard
            </Link>
          </div>
          <nav className="flex gap-2 text-sm">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition-colors hover:text-white hover:bg-white/5"
            >
              대시보드
            </Link>
            <Link
              href="/trigger"
              className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400"
            >
              테스트 실행
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          테스트 실행 트리거
        </h2>

        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-6">
          {/* Suite 선택 */}
          <fieldset className="mb-6">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Suite
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {SUITES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSuite(s.value)}
                  className={`rounded-lg border p-3 text-left transition-all ${
                    suite === s.value
                      ? "border-indigo-500/50 bg-indigo-500/10"
                      : "border-[var(--card-border)] bg-white/[0.02] hover:border-[var(--card-border)] hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-semibold ${suite === s.value ? "text-indigo-400" : "text-slate-300"}`}
                    >
                      {s.label}
                    </span>
                    {s.warn && (
                      <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                        VPN
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">{s.desc}</p>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Admin 경고 */}
          {selectedSuite?.warn && (
            <div className="mb-6 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Admin suite는 GitHub Hosted Runner에서 VPN/IP 제한으로 실패합니다.
              </p>
            </div>
          )}

          {/* 고급 옵션 */}
          <div className="mb-6 space-y-4">
            <InputField
              id="project"
              label="Project (선택)"
              placeholder="예: cmr-monitoring"
              value={project}
              onChange={setProject}
            />
            <InputField
              id="spec"
              label="Spec 파일 (선택)"
              placeholder="예: tests/cmr_monitoring_pom.spec.ts"
              value={spec}
              onChange={setSpec}
            />
            <InputField
              id="grep"
              label="Grep 패턴 (선택)"
              placeholder="예: CMR-HOME, CMR-SEARCH"
              value={grep}
              onChange={setGrep}
            />
            <div>
              <label
                htmlFor="retries"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
              >
                Retries
              </label>
              <select
                id="retries"
                value={retries}
                onChange={(e) => setRetries(e.target.value)}
                className="w-full rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n} className="bg-[var(--card)]">
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 실행 버튼 */}
          <button
            onClick={handleTrigger}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                트리거 중...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                테스트 실행
              </>
            )}
          </button>

          {/* 결과 표시 */}
          {result && (
            <div
              className={`mt-4 rounded-lg border px-4 py-3 ${
                result.ok
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-rose-500/20 bg-rose-500/5"
              }`}
            >
              {result.ok ? (
                <div>
                  <p className="text-sm font-semibold text-emerald-400">
                    {result.message}
                  </p>
                  {result.actionsUrl && (
                    <a
                      href={result.actionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      GitHub Actions에서 확인
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-rose-400">
                  {result.error}
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function InputField({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
      />
    </div>
  );
}
