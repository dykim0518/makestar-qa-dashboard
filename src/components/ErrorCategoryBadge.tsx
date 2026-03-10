import { ERROR_CATEGORY_DISPLAY, type ErrorCategory } from "@/lib/error-classifier";

export function ErrorCategoryBadge({ category }: { category: string }) {
  const display = ERROR_CATEGORY_DISPLAY[category as ErrorCategory];
  if (!display) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${display.bgColor} ${display.color}`}
    >
      {display.label}
    </span>
  );
}
