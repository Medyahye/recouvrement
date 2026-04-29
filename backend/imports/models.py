from django.db import models


class FabImport(models.Model):
    class Statut(models.TextChoices):
        EN_ATTENTE = "EN_ATTENTE", "En attente"
        EN_COURS = "EN_COURS", "En cours"
        SUCCES = "SUCCES", "Succes"
        ERREUR = "ERREUR", "Erreur"

    nom_fichier = models.CharField(max_length=255)
    fichier_original = models.FileField(upload_to="fab_uploads/")
    date_import = models.DateTimeField()
    date_fab = models.DateField(null=True, blank=True)
    nombre_lignes_total = models.PositiveIntegerField(default=0)
    nombre_lignes_apres_nettoyage = models.PositiveIntegerField(default=0)
    nombre_clients_filtres = models.PositiveIntegerField(default=0)
    nombre_zones = models.PositiveIntegerField(default=0)
    montant_total = models.FloatField(default=0)
    anciennete_moyenne_jours = models.FloatField(default=0)
    score_moyen_zones = models.FloatField(default=0)
    statut = models.CharField(
        max_length=20,
        choices=Statut.choices,
        default=Statut.EN_ATTENTE,
    )
    message_erreur = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_import", "-created_at"]

    def __str__(self) -> str:
        return f"{self.nom_fichier} - {self.statut}"
