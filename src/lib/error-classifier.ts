export type ErrorCategory =
  | "network_timeout"
  | "selector_not_found"
  | "assertion_failure"
  | "environment_issue"
  | "unknown";

interface CategoryRule {
  category: ErrorCategory;
  patterns: RegExp[];
}

const RULES: CategoryRule[] = [
  {
    category: "environment_issue",
    patterns: [
      /\b502\b/,
      /\b503\b/,
      /ECONNREFUSED/,
      /ENOTFOUND/,
      /Bad Gateway/i,
      /Service Unavailable/i,
    ],
  },
  {
    category: "network_timeout",
    patterns: [
      /TimeoutError/,
      /Timeout \d+ms exceeded/,
      /net::ERR_/,
      /ETIMEDOUT/,
      /ECONNRESET/,
      /waiting for/i,
      /exceeded.*timeout/i,
    ],
  },
  {
    category: "selector_not_found",
    patterns: [
      /locator\./,
      /waitForSelector/,
      /getByRole/,
      /getByText/,
      /getByTestId/,
      /getByLabel/,
      /strict mode violation/i,
      /resolved to \d+ elements/,
      /No element.*found/i,
    ],
  },
  {
    category: "assertion_failure",
    patterns: [
      /expect\(/,
      /toBe\b/,
      /toHaveText/,
      /toContain/,
      /toEqual/,
      /toHaveCount/,
      /toBeVisible/,
      /toHaveURL/,
      /Expected.*Received/i,
      /AssertionError/,
    ],
  },
];

export function classifyError(errorMessage: string | null): ErrorCategory | null {
  if (!errorMessage) return null;
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(errorMessage))) {
      return rule.category;
    }
  }
  return "unknown";
}

export const ERROR_CATEGORY_DISPLAY: Record<ErrorCategory, { label: string; color: string; bgColor: string }> = {
  network_timeout: {
    label: "네트워크/타임아웃",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/20",
  },
  selector_not_found: {
    label: "셀렉터 못 찾음",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
  },
  assertion_failure: {
    label: "검증 실패",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
  },
  environment_issue: {
    label: "환경 이슈",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  },
  unknown: {
    label: "기타",
    color: "text-slate-400",
    bgColor: "bg-slate-500/10 border-slate-500/20",
  },
};
