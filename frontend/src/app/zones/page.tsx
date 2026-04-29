import { PriorityBadge } from "@/components/ui/priority-badge";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { api } from "@/lib/api";
import { formatCurrency, formatDecimal } from "@/lib/format";

export default async function ZonesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? params.page : "1";
  const priorite = typeof params.priorite === "string" ? params.priorite : "";
  const codeCentre = typeof params.code_centre === "string" ? params.code_centre : "";
  const search = typeof params.search === "string" ? params.search : "";

  const query = `?page=${page}&priorite=${priorite}&code_centre=${codeCentre}&search=${search}`;
  const zonesResponse = await api.getLatestZones(query);
  const selectedZone = zonesResponse?.results[0] ? await api.getZoneDetail(zonesResponse.results[0].id) : null;

  const zones = zonesResponse?.results ?? [];
  const highCount = zones.filter((zone) => zone.priorite_zone === "HAUTE").length;
  const totalAmount = zones.reduce((acc, zone) => acc + zone.solde_total, 0);
  const avgAge = zones.length ? zones.reduce((acc, zone) => acc + zone.anciennete_moyenne_jours, 0) / zones.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-800">Zones prioritaires</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Nombre de zones" value={formatDecimal(zonesResponse?.count ?? 0, 0)} />
        <StatCard title="Zones haute priorité" value={formatDecimal(highCount, 0)} />
        <StatCard title="Montant total" value={`${formatCurrency(totalAmount)} MRU`} />
        <StatCard title="Ancienneté moyenne" value={`${formatDecimal(avgAge, 1)} jours`} />
      </div>

      <SectionCard title="Filtres">
        <form className="grid gap-3 md:grid-cols-4">
          <input
            name="code_centre"
            defaultValue={codeCentre}
            placeholder="Centre"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <select
            name="priorite"
            defaultValue={priorite}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Toutes priorités</option>
            <option value="HAUTE">Haute</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="FAIBLE">Faible</option>
          </select>
          <input
            name="search"
            defaultValue={search}
            placeholder="Code zone, secteur ou tournée"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white">Filtrer</button>
        </form>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <SectionCard title="Liste des zones">
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead className="border-b border-slate-200 text-left text-slate-500">
                <tr>
                  <th className="px-3 py-3">Zone</th>
                  <th className="px-3 py-3">Centre</th>
                  <th className="px-3 py-3">Secteur</th>
                  <th className="px-3 py-3">Tournée</th>
                  <th className="px-3 py-3">Nb clients</th>
                  <th className="px-3 py-3">Solde total</th>
                  <th className="px-3 py-3">Ancienneté</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Priorité</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">{zone.zone_code}</td>
                    <td className="px-3 py-3">{zone.code_centre}</td>
                    <td className="px-3 py-3">{zone.secteur_facturation}</td>
                    <td className="px-3 py-3">{zone.tournee_releve}</td>
                    <td className="px-3 py-3">{zone.nb_clients}</td>
                    <td className="px-3 py-3">{formatCurrency(zone.solde_total)} MRU</td>
                    <td className="px-3 py-3">{formatDecimal(zone.anciennete_moyenne_jours, 1)} j</td>
                    <td className="px-3 py-3">{formatDecimal(zone.score_zone, 1)}</td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={zone.priorite_zone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Détail de la zone sélectionnée">
          {selectedZone ? (
            <div className="space-y-3 text-sm text-slate-600">
              <p className="text-xl font-semibold text-slate-800">{selectedZone.zone_code}</p>
              <p>Centre: {selectedZone.code_centre}</p>
              <p>Secteur: {selectedZone.secteur_facturation}</p>
              <p>Tournée: {selectedZone.tournee_releve}</p>
              <p>Nombre de clients: {selectedZone.nb_clients}</p>
              <p>Solde total: {formatCurrency(selectedZone.solde_total)} MRU</p>
              <p>Ancienneté moyenne: {formatDecimal(selectedZone.anciennete_moyenne_jours, 1)} jours</p>
              <p>Score: {formatDecimal(selectedZone.score_zone, 1)} / 100</p>
              <div>
                <PriorityBadge priority={selectedZone.priorite_zone} />
              </div>
              <a href="/clients" className="inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm text-white">
                Voir les clients
              </a>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucune zone disponible.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
