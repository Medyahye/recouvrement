from __future__ import annotations

from imports.models import FabImport


def _compute_variation(current: float, previous: float) -> dict:
    variation = current - previous
    variation_pct = (variation / previous * 100) if previous not in (0, 0.0, None) else None
    return {
        "today": current,
        "previous": previous,
        "variation": variation,
        "variation_pct": round(variation_pct, 2) if variation_pct is not None else None,
    }


def compare_latest_imports() -> dict:
    successful_imports = FabImport.objects.filter(statut=FabImport.Statut.SUCCES).order_by("-date_import", "-id")
    latest_fab = successful_imports.first()
    previous_fab = successful_imports[1] if successful_imports.count() > 1 else None

    if not latest_fab:
        return {"available": False, "message": "Aucun FAB importe avec succes."}

    if not previous_fab:
        return {
            "available": False,
            "message": "Aucune comparaison disponible. Premier FAB importé.",
            "latest_import_id": latest_fab.id,
        }

    return {
        "available": True,
        "latest_import_id": latest_fab.id,
        "previous_import_id": previous_fab.id,
        "clients": _compute_variation(latest_fab.nombre_clients_filtres, previous_fab.nombre_clients_filtres),
        "zones": _compute_variation(latest_fab.nombre_zones, previous_fab.nombre_zones),
        "montant": _compute_variation(latest_fab.montant_total, previous_fab.montant_total),
        "anciennete": _compute_variation(
            latest_fab.anciennete_moyenne_jours,
            previous_fab.anciennete_moyenne_jours,
        ),
        "score_moyen": _compute_variation(latest_fab.score_moyen_zones, previous_fab.score_moyen_zones),
    }
