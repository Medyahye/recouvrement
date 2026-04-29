from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from clients.models import Client
from imports.models import FabImport
from imports.serializers import FabImportSerializer
from imports.services.fab_processor import process_fab_file
from imports.services.import_comparison import compare_latest_imports
from scoring.services.scoring_service import score_clients_and_zones
from zones.models import Zone


class ImportUploadAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response({"detail": "Aucun fichier selectionne."}, status=status.HTTP_400_BAD_REQUEST)

        if not uploaded_file.name.lower().endswith((".txt", ".csv")):
            return Response({"detail": "Format incorrect. Utilisez un fichier .txt ou .csv."}, status=400)

        fab_import = FabImport.objects.create(
            nom_fichier=uploaded_file.name,
            fichier_original=uploaded_file,
            date_import=timezone.now(),
            statut=FabImport.Statut.EN_COURS,
        )

        try:
            with transaction.atomic():
                fab_import.fichier_original.open("rb")
                cleaned_df, import_summary = process_fab_file(fab_import.fichier_original)
                clients_df, zones_df, scoring_summary = score_clients_and_zones(cleaned_df)

                client_objects = [
                    Client(
                        fab_import=fab_import,
                        ref_abonnement=row.ref_abonnement,
                        nom_client=row.nom_client or "",
                        adresse_client=row.adresse_client or "",
                        telephone=row.telephone or "",
                        numero_compteur=row.numero_compteur or "",
                        code_centre=row.code_centre,
                        secteur_facturation=row.secteur_facturation,
                        tournee_releve=row.tournee_releve,
                        zone_code=row.zone_code,
                        activite_client=row.activite_client or "",
                        famille_activite=row.famille_activite or "",
                        solde=float(row.solde),
                        code_relance=int(row.code_relance),
                        date_derniere_facture=row.date_derniere_facture,
                        date_dernier_paiement=row.date_dernier_paiement,
                        anciennete_jours=int(row.anciennete_jours),
                        anciennete_cappee=int(row.anciennete_cappee),
                        score_solde=float(row.score_solde),
                        score_activite=float(row.score_activite),
                        score_anciennete=float(row.score_anciennete),
                        score_client=float(row.score_client),
                        priorite_client=row.priorite_client,
                    )
                    for row in clients_df.itertuples(index=False)
                ]
                Client.objects.bulk_create(client_objects, batch_size=1000)

                zone_objects = [
                    Zone(
                        fab_import=fab_import,
                        zone_code=row.zone_code,
                        code_centre=row.code_centre,
                        secteur_facturation=row.secteur_facturation,
                        tournee_releve=row.tournee_releve,
                        nb_clients=int(row.nb_clients),
                        solde_total=float(row.solde_total),
                        solde_moyen=float(row.solde_moyen),
                        solde_max=float(row.solde_max),
                        anciennete_moyenne_jours=float(row.anciennete_moyenne_jours),
                        anciennete_max_jours=float(row.anciennete_max_jours),
                        score_activite_moyen=float(row.score_activite_moyen),
                        score_solde_total=float(row.score_solde_total),
                        score_nb_clients=float(row.score_nb_clients),
                        score_anciennete_zone=float(row.score_anciennete_zone),
                        score_activite_zone=float(row.score_activite_zone),
                        score_zone=float(row.score_zone),
                        priorite_zone=row.priorite_zone,
                        activite_dominante=row.activite_dominante or "",
                    )
                    for row in zones_df.itertuples(index=False)
                ]
                Zone.objects.bulk_create(zone_objects, batch_size=1000)

                fab_import.date_fab = import_summary["date_fab"]
                fab_import.nombre_lignes_total = import_summary["nombre_lignes_total"]
                fab_import.nombre_lignes_apres_nettoyage = import_summary["nombre_lignes_apres_nettoyage"]
                fab_import.nombre_clients_filtres = len(client_objects)
                fab_import.nombre_zones = len(zone_objects)
                fab_import.montant_total = round(float(clients_df["solde"].sum()), 2)
                fab_import.anciennete_moyenne_jours = round(float(clients_df["anciennete_jours"].mean()), 2)
                fab_import.score_moyen_zones = scoring_summary["score_moyen_zones"]
                fab_import.statut = FabImport.Statut.SUCCES
                fab_import.message_erreur = ""
                fab_import.save()
                fab_import.fichier_original.close()
        except Exception as exc:
            fab_import.fichier_original.close()
            fab_import.statut = FabImport.Statut.ERREUR
            fab_import.message_erreur = str(exc)
            fab_import.save(update_fields=["statut", "message_erreur", "updated_at"])
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FabImportSerializer(fab_import)
        return Response(
            {
                "summary": serializer.data,
                "comparison": compare_latest_imports(),
            },
            status=status.HTTP_201_CREATED,
        )


class ImportListAPIView(APIView):
    def get(self, request):
        imports = FabImport.objects.all().order_by("-date_import")
        return Response(FabImportSerializer(imports, many=True).data)


class LatestImportAPIView(APIView):
    def get(self, request):
        latest = FabImport.objects.filter(statut=FabImport.Statut.SUCCES).first()
        if not latest:
            return Response({"detail": "Aucun import reussi disponible."}, status=404)
        return Response(FabImportSerializer(latest).data)


class LatestImportComparisonAPIView(APIView):
    def get(self, request):
        return Response(compare_latest_imports())
