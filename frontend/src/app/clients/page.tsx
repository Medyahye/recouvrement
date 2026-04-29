import { PriorityBadge } from "@/components/ui/priority-badge";
import { SectionCard } from "@/components/ui/section-card";
import { api } from "@/lib/api";
import { formatCurrency, formatDate, formatDecimal } from "@/lib/format";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? params.page : "1";
  const zoneCode = typeof params.zone_code === "string" ? params.zone_code : "";
  const codeCentre = typeof params.code_centre === "string" ? params.code_centre : "";
  const activite = typeof params.activite === "string" ? params.activite : "";
  const priorite = typeof params.priorite === "string" ? params.priorite : "";
  const search = typeof params.search === "string" ? params.search : "";

  const query = `?page=${page}&zone_code=${zoneCode}&code_centre=${codeCentre}&activite=${activite}&priorite=${priorite}&search=${search}`;
  const clientsResponse = await api.getLatestClients(query);
  const clients = clientsResponse?.results ?? [];
  const selectedClient = clients[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-800">Clients</h1>
      </div>

      <SectionCard title="Filtres">
        <form className="grid gap-3 md:grid-cols-5">
          <input
            name="code_centre"
            defaultValue={codeCentre}
            placeholder="Centre"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <input
            name="zone_code"
            defaultValue={zoneCode}
            placeholder="Zone"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <input
            name="activite"
            defaultValue={activite}
            placeholder="Activité"
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
            placeholder="Nom ou référence"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white md:col-span-5 md:w-40">
            Filtrer
          </button>
        </form>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <SectionCard title="Liste des clients">
          <div className="overflow-x-auto">
            <table className="text-sm">
              <thead className="border-b border-slate-200 text-left text-slate-500">
                <tr>
                  <th className="px-3 py-3">Réf abonnement</th>
                  <th className="px-3 py-3">Nom client</th>
                  <th className="px-3 py-3">Zone</th>
                  <th className="px-3 py-3">Activité</th>
                  <th className="px-3 py-3">Famille</th>
                  <th className="px-3 py-3">Solde</th>
                  <th className="px-3 py-3">Dernier paiement</th>
                  <th className="px-3 py-3">Ancienneté</th>
                  <th className="px-3 py-3">Score</th>
                  <th className="px-3 py-3">Priorité</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-100">
                    <td className="px-3 py-3">{client.ref_abonnement}</td>
                    <td className="px-3 py-3">{client.nom_client}</td>
                    <td className="px-3 py-3">{client.zone_code}</td>
                    <td className="px-3 py-3">{client.activite_client}</td>
                    <td className="px-3 py-3">{client.famille_activite}</td>
                    <td className="px-3 py-3">{formatCurrency(client.solde)} MRU</td>
                    <td className="px-3 py-3">{formatDate(client.date_dernier_paiement)}</td>
                    <td className="px-3 py-3">{client.anciennete_jours} j</td>
                    <td className="px-3 py-3">{formatDecimal(client.score_client, 1)}</td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={client.priorite_client} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Détails du client sélectionné">
          {selectedClient ? (
            <div className="space-y-3 text-sm text-slate-600">
              <p className="text-lg font-semibold text-slate-800">{selectedClient.nom_client}</p>
              <p>Référence: {selectedClient.ref_abonnement}</p>
              <p>Zone: {selectedClient.zone_code}</p>
              <p>Centre: {selectedClient.code_centre}</p>
              <p>Activité: {selectedClient.activite_client}</p>
              <p>Famille: {selectedClient.famille_activite}</p>
              <p>Adresse: {selectedClient.adresse_client || "-"}</p>
              <p>Téléphone: {selectedClient.telephone || "-"}</p>
              <p>Compteur: {selectedClient.numero_compteur || "-"}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucun client disponible.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
