import { ImportFabPage } from "@/components/import-fab-page";
import { api } from "@/lib/api";

export default async function ImportFabRoute() {
  const [latestImport, comparison] = await Promise.all([api.getLatestImport(), api.getLatestComparison()]);

  return <ImportFabPage initialImport={latestImport} initialComparison={comparison} />;
}
