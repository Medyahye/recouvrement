from django.db import models


class Zone(models.Model):
    class Priorite(models.TextChoices):
        HAUTE = "HAUTE", "Haute"
        MOYENNE = "MOYENNE", "Moyenne"
        FAIBLE = "FAIBLE", "Faible"

    fab_import = models.ForeignKey(
        "imports.FabImport",
        on_delete=models.CASCADE,
        related_name="zones",
    )
    zone_code = models.CharField(max_length=120, db_index=True)
    code_centre = models.CharField(max_length=50, db_index=True)
    secteur_facturation = models.CharField(max_length=50, db_index=True)
    tournee_releve = models.CharField(max_length=50, db_index=True)
    nb_clients = models.PositiveIntegerField(default=0)
    solde_total = models.FloatField(default=0)
    solde_moyen = models.FloatField(default=0)
    solde_max = models.FloatField(default=0)
    anciennete_moyenne_jours = models.FloatField(default=0)
    anciennete_max_jours = models.FloatField(default=0)
    score_activite_moyen = models.FloatField(default=0)
    score_solde_total = models.FloatField(default=0)
    score_nb_clients = models.FloatField(default=0)
    score_anciennete_zone = models.FloatField(default=0)
    score_activite_zone = models.FloatField(default=0)
    score_zone = models.FloatField(default=0, db_index=True)
    priorite_zone = models.CharField(
        max_length=10,
        choices=Priorite.choices,
        default=Priorite.FAIBLE,
        db_index=True,
    )
    activite_dominante = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-score_zone", "-solde_total"]

    def __str__(self) -> str:
        return self.zone_code
