"use client";

type Props = {
  haute: number;
  moyenne: number;
  faible: number;
};

export function PriorityChart({ haute, moyenne, faible }: Props) {
  const bars = [
    { label: "Haute",   value: haute,   bg: "bg-red-400",    text: "text-red-600" },
    { label: "Moyenne", value: moyenne, bg: "bg-orange-400", text: "text-orange-500" },
    { label: "Faible",  value: faible,  bg: "bg-green-400",  text: "text-green-600" },
  ];

  const max = Math.max(haute, moyenne, faible, 1);

  const ticks = [
    Math.round(max),
    Math.round(max * 0.75),
    Math.round(max * 0.50),
    Math.round(max * 0.25),
    0,
  ];

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">Nombre de zones</p>

      <div className="flex gap-2 h-44" style={{ alignItems: "flex-end" }}>

        {/* Axe Y */}
        <div className="flex flex-col justify-between h-full text-right pr-1">
          {ticks.map((t, i) => (
            <span key={i} className="text-xs text-slate-300 leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Zone graphique */}
        <div
          className="relative flex flex-1 gap-6 h-full"
          style={{ alignItems: "flex-end" }}
        >

          {/* Lignes horizontales */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {ticks.map((_, i) => (
              <div key={i} className="w-full border-t border-slate-100" />
            ))}
          </div>

          {/* Barres */}
          {bars.map((bar) => {
            const heightPct = Math.max(
              (bar.value / max) * 100,
              bar.value > 0 ? 3 : 0
            );
            return (
              <div
                key={bar.label}
                className="relative z-10 flex flex-1 flex-col items-center gap-1 h-full justify-end"
              >
                <span className={`text-xs font-semibold ${bar.text}`}>
                  {bar.value}
                </span>
                <div
                  className={`w-full rounded-t-md ${bar.bg} transition-all duration-500`}
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-xs text-slate-500 mt-1">{bar.label}</span>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}