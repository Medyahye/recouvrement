import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { api, API_BASE_URL } from "@/lib/api";
import { formatCurrency, formatDate, formatDecimal } from "@/lib/format";

async function generateReport() {
  "use server";

  await fetch(`${API_BASE_URL}/reports/generate/`, {
    method: "POST",
    cache: "no-store",
  });
}

export default async function ReportsPage() {
  const latestImport = await api.getLatestImport();
  const reports = await api.getReports();
  const recentReports = reports?.slice(0, 10) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">Rapports</h1>
        </div>
        <form action={generateReport}>
          <button className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700">
            Générer rapport Word
          </button>
        </form>
      </div>

      {latestImport ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Date de traitement" value={formatDate(latestImport.date_import)} />
            <StatCard title="Nombre de clients" value={formatDecimal(latestImport.nombre_clients_filtres, 0)} />
            <StatCard title="Nombre de zones" value={formatDecimal(latestImport.nombre_zones, 0)} />
            <StatCard title="Montant total" value={`${formatCurrency(latestImport.montant_total)} MRU`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <SectionCard title="Aperçu du rapport quotidien">
              <div className="space-y-3 text-sm text-slate-600">
                <p>Fichier FAB: {latestImport.nom_fichier}</p>
                <p>Clients retenus: {latestImport.nombre_clients_filtres}</p>
                <p>Zones générées: {latestImport.nombre_zones}</p>
                <p>Montant total: {formatCurrency(latestImport.montant_total)} MRU</p>
                <p>Ancienneté moyenne: {formatDecimal(latestImport.anciennete_moyenne_jours, 1)} jours</p>
                <p>Score moyen des zones: {formatDecimal(latestImport.score_moyen_zones, 1)}</p>
              </div>
            </SectionCard>

            <SectionCard title="Sorties générées">
              <div className="space-y-3 text-sm text-slate-600">
                <p>clients_scores_code_relance_1.csv</p>
                <p>zones_prioritaires_code_relance_1.csv</p>
                <p>rapport_recouvrement.docx</p>
              </div>
            </SectionCard>
          </div>
        </>
      ) : (
        <SectionCard title="Résumé rapport quotidien">
          <p className="text-sm text-slate-500">Aucun import disponible pour générer un rapport.</p>
        </SectionCard>
      )}

      <SectionCard title="Historique des rapports">
        <div className="overflow-x-auto">
          <table className="text-sm">
            <thead className="border-b border-slate-200 text-left text-slate-500">
              <tr>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Fichier source</th>
                <th className="px-3 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3">{formatDate(item.date_generation)}</td>
                  <td className="px-3 py-3">{item.type_rapport}</td>
                  <td className="px-3 py-3">{item.titre}</td>
                  <td className="px-3 py-3">{item.format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
