from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from imports.models import FabImport
from zones.models import Zone
from zones.serializers import ZoneDetailSerializer, ZoneSerializer


class ZonePagination(PageNumberPagination):
    page_size = 12


class LatestZonesAPIView(APIView):
    def get(self, request):
        latest_fab = FabImport.objects.filter(statut=FabImport.Statut.SUCCES).first()
        if not latest_fab:
            return Response({"detail": "Aucun import reussi disponible."}, status=404)

        queryset = latest_fab.zones.all().order_by("-score_zone")
        priorite = request.GET.get("priorite")
        code_centre = request.GET.get("code_centre")
        search = request.GET.get("search")

        if priorite:
            queryset = queryset.filter(priorite_zone=priorite.upper())
        if code_centre:
            queryset = queryset.filter(code_centre__iexact=code_centre)
        if search:
            queryset = queryset.filter(
                Q(zone_code__icontains=search)
                | Q(secteur_facturation__icontains=search)
                | Q(tournee_releve__icontains=search)
            )

        paginator = ZonePagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ZoneSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ZoneDetailAPIView(APIView):
    def get(self, request, pk: int):
        latest_fab = FabImport.objects.filter(statut=FabImport.Statut.SUCCES).first()
        if not latest_fab:
            return Response({"detail": "Aucun import reussi disponible."}, status=404)

        zone = latest_fab.zones.filter(pk=pk).first()
        if not zone:
            return Response({"detail": "Zone introuvable."}, status=404)

        return Response(ZoneDetailSerializer(zone).data)
