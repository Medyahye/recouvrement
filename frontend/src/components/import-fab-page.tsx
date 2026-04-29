"use client";

import { useMemo, useState } from "react";

import { API_BASE_URL } from "@/lib/api";
import { formatCurrency, formatDecimal } from "@/lib/format";
import type { ComparisonResponse, FabImport } from "@/lib/types";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";

function ComparisonCard({
  label,
  data,
  unit = "",
}: {
  label: string;
  data: { today: number; previous: number; variation: number; variation_pct: number | null };
  unit?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-800">
        Aujourd&apos;hui: {formatDecimal(data.today, 2)}
        {unit}
      </p>
      <p className="text-sm text-slate-500">
        Précédent: {formatDecimal(data.previous, 2)}
        {unit}
      </p>
      <p className="text-sm text-slate-500">
        Variation: {formatDecimal(data.variation, 2)}
        {unit} {data.variation_pct !== null ? `(${formatDecimal(data.variation_pct, 2)}%)` : ""}
      </p>
    </div>
  );
}

export function ImportFabPage({
  initialImport,
  initialComparison,
}: {
  initialImport: FabImport | null;
  initialComparison: ComparisonResponse | null;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestImport, setLatestImport] = useState<FabImport | null>(initialImport);
  const [comparison, setComparison] = useState<ComparisonResponse | null>(initialComparison);

  const fileMeta = useMemo(() => {
    if (!selectedFile) return null;
    return {
      taille: `${(selectedFile.size / 1024 / 1024).toFixed(2)} Mo`,
      nom: selectedFile.name,
    };
  }, [selectedFile]);

  async function handleUpload() {
    if (!selectedFile) {
      setError("Aucun fichier sélectionné.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/imports/upload/`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.detail || "Erreur serveur.");
      }

      setLatestImport(payload.summary);
      setComparison(payload.comparison);
      setSelectedFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Erreur serveur.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-800">Import FAB</h1>
        <p className="mt-2 text-slate-500">
          Importez le fichier FAB du jour pour lancer le nettoyage, le filtrage et le calcul des zones
          prioritaires.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Importer le fichier FAB du jour">
          <div className="rounded-xl border border-dashed border-blue-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-700">Glissez-déposez votre fichier ici</p>
            <p className="my-3 text-sm text-slate-500">ou</p>
            <div className="flex flex-wrap justify-center gap-3">
              <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm">
                Choisir un fichier
                <input
                  type="file"
                  accept=".txt,.csv"
                  className="hidden"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
              </label>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isLoading}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isLoading ? "Traitement..." : "Lancer le traitement"}
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-400">Formats acceptés : .txt, .csv</p>
          </div>
          {isLoading ? <p className="mt-4 text-sm text-blue-700">Traitement du fichier en cours...</p> : null}
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </SectionCard>

        <SectionCard title="Fichier sélectionné">
          {fileMeta ? (
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Nom:</span> {fileMeta.nom}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Taille:</span> {fileMeta.taille}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucun fichier sélectionné.</p>
          )}
        </SectionCard>
      </div>

      {latestImport ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <StatCard title="Nom fichier" value={latestImport.nom_fichier} />
            <StatCard title="Lignes totales" value={formatDecimal(latestImport.nombre_lignes_total, 0)} />
            <StatCard title="Clients retenus" value={formatDecimal(latestImport.nombre_clients_filtres, 0)} />
            <StatCard title="Zones générées" value={formatDecimal(latestImport.nombre_zones, 0)} />
            <StatCard title="Montant total" value={`${formatCurrency(latestImport.montant_total)} MRU`} />
            <StatCard
              title="Ancienneté moyenne"
              value={`${formatDecimal(latestImport.anciennete_moyenne_jours, 1)} jours`}
              subtitle={latestImport.statut}
            />
          </div>

          <SectionCard
            title="Comparaison avec le dernier FAB importé"
            action={
              <a href="/zones" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white">
                Voir les zones prioritaires
              </a>
            }
          >
            {comparison?.available && comparison.clients && comparison.montant && comparison.zones && comparison.anciennete ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ComparisonCard label="Clients retenus" data={comparison.clients} />
                <ComparisonCard label="Montant total" data={comparison.montant} unit=" MRU" />
                <ComparisonCard label="Zones identifiées" data={comparison.zones} />
                <ComparisonCard label="Ancienneté moyenne" data={comparison.anciennete} unit=" j" />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                {comparison?.message || "Aucune comparaison disponible. Premier FAB importé."}
              </p>
            )}
          </SectionCard>
        </>
      ) : null}
    </div>
  );
}
