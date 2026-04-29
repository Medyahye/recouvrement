import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { PriorityChart } from "@/components/ui/priority-chart";
import { formatCurrency, formatDate, formatDecimal } from "@/lib/format";
import { api } from "@/lib/api";
import {
  FileText,
  Users,
  MapPinned,
  Banknote,
  CalendarClock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const dashboard = await api.getDashboard();

  if (!dashboard) {
    return (
      <SectionCard title="Tableau de bord">
        <p className="text-sm text-slate-400">
          Aucune donnée disponible. Lancez d&apos;abord un import FAB.
        </p>
      </SectionCard>
    );
  }

  const { HAUTE = 0, MOYENNE = 0, FAIBLE = 0 } = dashboard.repartition_priorites;
  const t = dashboard.resume_dernier_traitement;

  return (
    <div className="space-y-6">

      {/* En-tête page */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-400">
          Vue d&apos;ensemble des indicateurs clés et des résultats du traitement.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Dernier FAB importé"
          value={dashboard.dernier_fichier}
          subtitle={formatDate(t.date_import)}
          icon={<FileText size={18} className="text-blue-600" />}
          iconBg="bg-blue-50"
          valueClassName="text-sm font-semibold"
        />
        <StatCard
          title="Clients retenus"
          value={formatDecimal(dashboard.clients_filtres, 0)}
          subtitle="clients"
          icon={<Users size={18} className="text-violet-600" />}
          iconBg="bg-violet-50"
          valueClassName="text-3xl"
        />
        <StatCard
          title="Zones identifiées"
          value={formatDecimal(dashboard.nombre_zones, 0)}
          subtitle="zones"
          icon={<MapPinned size={18} className="text-teal-600" />}
          iconBg="bg-teal-50"
          valueClassName="text-3xl"
        />
        <StatCard
          title="Montant total"
          value={formatCurrency(dashboard.montant_total)}
          subtitle="MRU"
          icon={<Banknote size={18} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          valueClassName="text-2xl"
        />
        <StatCard
          title="Ancienneté moyenne"
          value={formatDecimal(dashboard.anciennete_moyenne, 1)}
          subtitle="jours"
          icon={<CalendarClock size={18} className="text-amber-500" />}
          iconBg="bg-amber-50"
          valueClassName="text-3xl"
        />
        <StatCard
          title="Potentiel de recouvrement"
          value={`${formatDecimal(dashboard.score_moyen, 1)} %`}
          subtitle="du montant total"
          icon={<TrendingUp size={18} className="text-green-600" />}
          iconBg="bg-green-50"
          valueClassName="text-3xl text-green-600"
        />
      </div>

      {/* Grille principale */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">

        {/* Top 10 zones */}
        <SectionCard
          title="Top 10 zones prioritaires"
          action={
            <Link
              href="/zones"
              className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Voir toutes les zones
              <ArrowRight size={12} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Zone
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Nb clients
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Solde total
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Score
                  </th>
                  <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Priorité
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dashboard.top_10_zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {zone.zone_code}
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {zone.nb_clients}
                    </td>
                    <td className="px-3 py-3 text-slate-500">
                      {formatCurrency(zone.solde_total)} MRU
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-700">
                      {formatDecimal(zone.score_zone, 1)}
                    </td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={zone.priorite_zone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Colonne droite */}
        <div className="space-y-5">

          {/* Graphique répartition */}
          <SectionCard title="Répartition des zones par priorité">
            <PriorityChart haute={HAUTE} moyenne={MOYENNE} faible={FAIBLE} />
          </SectionCard>

          {/* Résumé traitement */}
          <SectionCard title="Résumé du dernier traitement">
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-blue-500 mt-0.5 shrink-0" />
                <span>
                  Fichier FAB importé :{" "}
                  <span className="font-medium text-slate-700">
                    {dashboard.dernier_fichier}
                  </span>{" "}
                  ({t.nombre_lignes_total.toLocaleString("fr-FR")} lignes).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <span className="font-medium text-slate-700">
                    {formatDecimal(dashboard.clients_filtres, 0)}
                  </span>{" "}
                  clients retenus après filtrage et nettoyage.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <span className="font-medium text-slate-700">
                    {formatDecimal(dashboard.nombre_zones, 0)}
                  </span>{" "}
                  zones identifiées avec un montant total de{" "}
                  <span className="font-medium text-slate-700">
                    {formatCurrency(dashboard.montant_total)} MRU
                  </span>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={15} className="text-blue-500 mt-0.5 shrink-0" />
                <span>
                  Score moyen des zones :{" "}
                  <span className="font-medium text-slate-700">
                    {formatDecimal(dashboard.score_moyen, 1)}
                  </span>.
                </span>
              </li>
            </ul>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}