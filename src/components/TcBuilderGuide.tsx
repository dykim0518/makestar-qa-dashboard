"use client";

import { useState } from "react";

const steps = [
  {
    num: 1,
    title: "프로젝트 생성",
    desc: "새 프로젝트명을 입력하고 \"+ 생성\" 버튼을 클릭합니다. 이미 만든 프로젝트가 있으면 드롭다운에서 선택하세요.",
    color: "text-indigo-400",
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/5",
  },
  {
    num: 2,
    title: "소스 추가 (요구사항 수집)",
    desc: "소스 카드에서 \"+ 추가\" 를 클릭하면 Notion / Figma / PDF 중 하나를 선택하여 URL 또는 파일을 입력할 수 있습니다. 수집이 완료되면 요구사항 수가 자동으로 업데이트됩니다. 여러 소스를 반복 추가할 수 있습니다.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    num: 3,
    title: "템플릿 임포트 & 승인",
    desc: "템플릿 카드에서 \"임포트\" 를 클릭하고 기존 TC가 작성된 Google Sheet URL을 붙여 넣은 뒤 \"분석\" 을 클릭합니다. 분석 결과가 draft 상태로 생성되면 \"승인\" 버튼을 눌러 확정합니다.",
    color: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    num: 4,
    title: "TC 생성",
    desc: "템플릿이 승인되면 \"TC 생성\" 섹션이 나타납니다. \"초안 생성\" 은 빠르게 대략적인 TC를 만들고, \"엄격 생성\" 은 스타일까지 정밀하게 맞춥니다. 생성이 완료되면 실행 이력에 카드가 추가됩니다.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    num: 5,
    title: "검증 & 내보내기",
    desc: "실행 이력 카드에서 \"검증\" 을 클릭하면 중복·누락·포맷 이슈와 커버리지를 확인합니다. \"CSV\" 로 로컬 다운로드하거나, \"Sheets\" 버튼으로 Google Sheet에 바로 내보낼 수 있습니다. \"상세\" 를 클릭하면 Run 상세 페이지로 이동합니다.",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
];

export function TcBuilderGuide() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          사용 가이드
        </span>
        <svg
          className={`h-4 w-4 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-[var(--card-border)] px-5 pb-5 pt-4">
          {/* Flow diagram */}
          <div className="mb-5 flex items-center justify-center gap-1 text-[10px] font-semibold">
            <span className="rounded-md bg-indigo-500/15 px-2 py-1 text-indigo-300">프로젝트</span>
            <span className="text-[var(--muted)]">→</span>
            <span className="rounded-md bg-blue-500/15 px-2 py-1 text-blue-300">소스 수집</span>
            <span className="text-[var(--muted)]">→</span>
            <span className="rounded-md bg-purple-500/15 px-2 py-1 text-purple-300">템플릿</span>
            <span className="text-[var(--muted)]">→</span>
            <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-300">TC 생성</span>
            <span className="text-[var(--muted)]">→</span>
            <span className="rounded-md bg-amber-500/15 px-2 py-1 text-amber-300">검증/내보내기</span>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`rounded-lg border ${s.border} ${s.bg} px-4 py-3`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold ${s.color}`}>
                    {s.num}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${s.color}`}>{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-4 rounded-lg border border-[var(--card-border)] bg-white/[0.02] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">팁</p>
            <ul className="space-y-1 text-xs text-[var(--muted)]">
              <li>• 소스는 <strong className="text-white/80">Notion, Figma, PDF</strong> 중 여러 개를 조합할 수 있습니다.</li>
              <li>• 템플릿은 <strong className="text-white/80">기존 TC Google Sheet</strong>의 스타일을 분석하여 동일한 포맷으로 생성합니다.</li>
              <li>• <strong className="text-white/80">초안 생성</strong>은 빠른 프로토타입용, <strong className="text-white/80">엄격 생성</strong>은 최종 산출물용으로 사용하세요.</li>
              <li>• 검증 후 이슈가 있으면 소스를 추가하거나 다시 생성하여 개선할 수 있습니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
