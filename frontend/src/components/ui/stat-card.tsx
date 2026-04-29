import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBg?: string;
  valueClassName?: string;
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-blue-50",
  valueClassName = "",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-start gap-4">
      
      {/* Icône */}
      {icon && (
        <div className={`shrink-0 w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mt-0.5`}>
          {icon}
        </div>
      )}

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
          {title}
        </p>
        <p className={`font-bold text-slate-800 leading-tight break-words ${valueClassName}`}>
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>

    </div>
  );
}