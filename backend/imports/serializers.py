from rest_framework import serializers

from imports.models import FabImport


class FabImportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FabImport
        fields = "__all__"
