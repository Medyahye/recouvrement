import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

export function SectionCard({ title, children, action }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {action && <div>{action}</div>}
      </div>

      {/* Contenu */}
      {children}

    </section>
  );
}