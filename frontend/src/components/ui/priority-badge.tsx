import type { Priority } from "@/lib/types";

const styles: Record<Priority, string> = {
  HAUTE:   "bg-red-50 text-red-600 border border-red-100",
  MOYENNE: "bg-orange-50 text-orange-500 border border-orange-100",
  FAIBLE:  "bg-green-50 text-green-600 border border-green-100",
};

const labels: Record<Priority, string> = {
  HAUTE:   "Haute",
  MOYENNE: "Moyenne",
  FAIBLE:  "Faible",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}