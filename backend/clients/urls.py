from django.urls import path

from clients.views import LatestClientsAPIView

urlpatterns = [
    path("latest/", LatestClientsAPIView.as_view(), name="clients-latest"),
]
