from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from clients.serializers import ClientSerializer
from imports.models import FabImport


class ClientPagination(PageNumberPagination):
    page_size = 10


class LatestClientsAPIView(APIView):
    def get(self, request):
        latest_fab = FabImport.objects.filter(statut=FabImport.Statut.SUCCES).first()
        if not latest_fab:
            return Response({"detail": "Aucun import reussi disponible."}, status=404)

        queryset = latest_fab.clients.all().order_by("-score_client")
        zone_code = request.GET.get("zone_code")
        code_centre = request.GET.get("code_centre")
        activite = request.GET.get("activite")
        priorite = request.GET.get("priorite")
        search = request.GET.get("search")

        if zone_code:
            queryset = queryset.filter(zone_code__iexact=zone_code)
        if code_centre:
            queryset = queryset.filter(code_centre__iexact=code_centre)
        if activite:
            queryset = queryset.filter(activite_client__icontains=activite)
        if priorite:
            queryset = queryset.filter(priorite_client=priorite.upper())
        if search:
            queryset = queryset.filter(Q(ref_abonnement__icontains=search) | Q(nom_client__icontains=search))

        paginator = ClientPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = ClientSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
