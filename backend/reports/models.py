from django.db import models


class Report(models.Model):
    class TypeRapport(models.TextChoices):
        QUOTIDIEN = "QUOTIDIEN", "Quotidien"
        ZONES = "ZONES", "Zones"
        CLIENTS = "CLIENTS", "Clients"

    class FormatRapport(models.TextChoices):
        WORD = "WORD", "Word"
        PDF = "PDF", "PDF"
        CSV = "CSV", "CSV"

    fab_import = models.ForeignKey(
        "imports.FabImport",
        on_delete=models.CASCADE,
        related_name="reports",
    )
    titre = models.CharField(max_length=255)
    type_rapport = models.CharField(max_length=20, choices=TypeRapport.choices)
    format = models.CharField(max_length=20, choices=FormatRapport.choices)
    fichier = models.FileField(upload_to="reports/")
    date_generation = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_generation", "-created_at"]

    def __str__(self) -> str:
        return self.titre
