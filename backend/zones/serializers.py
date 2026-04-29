from rest_framework import serializers

from clients.serializers import ClientSerializer
from zones.models import Zone


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = "__all__"


class ZoneDetailSerializer(serializers.ModelSerializer):
    clients = serializers.SerializerMethodField()

    class Meta:
        model = Zone
        fields = "__all__"

    def get_clients(self, obj):
        clients = obj.fab_import.clients.filter(zone_code=obj.zone_code).order_by("-score_client")[:100]
        return ClientSerializer(clients, many=True).data
