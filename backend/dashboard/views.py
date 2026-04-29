from rest_framework.response import Response
from rest_framework.views import APIView

from imports.models import FabImport


class LatestDashboardAPIView(APIView):
    def get(self, request):
        latest_fab = FabImport.objects.filter(statut=FabImport.Statut.SUCCES).first()
        if not latest_fab:
            return Response({"detail": "Aucun import reussi disponible."}, status=404)

        zones = latest_fab.zones.order_by("-score_zone")
        repartition = {
            "HAUTE": zones.filter(priorite_zone="HAUTE").count(),
            "MOYENNE": zones.filter(priorite_zone="MOYENNE").count(),
            "FAIBLE": zones.filter(priorite_zone="FAIBLE").count(),
        }

        payload = {
            "dernier_fichier": latest_fab.nom_fichier,
            "clients_filtres": latest_fab.nombre_clients_filtres,
            "nombre_zones": latest_fab.nombre_zones,
            "zones_haute_priorite": repartition["HAUTE"],
            "montant_total": latest_fab.montant_total,
            "anciennete_moyenne": latest_fab.anciennete_moyenne_jours,
            "score_moyen": latest_fab.score_moyen_zones,
            "potentiel_recouvrement_estime": latest_fab.montant_total,
            "top_10_zones": list(
                zones.values(
                    "id",
                    "zone_code",
                    "code_centre",
                    "secteur_facturation",
                    "tournee_releve",
                    "nb_clients",
                    "solde_total",
                    "anciennete_moyenne_jours",
                    "score_zone",
                    "priorite_zone",
                )[:10]
            ),
            "repartition_priorites": repartition,
            "resume_dernier_traitement": {
                "date_import": latest_fab.date_import,
                "statut": latest_fab.statut,
                "nombre_lignes_total": latest_fab.nombre_lignes_total,
                "nombre_lignes_apres_nettoyage": latest_fab.nombre_lignes_apres_nettoyage,
            },
        }
        return Response(payload)
