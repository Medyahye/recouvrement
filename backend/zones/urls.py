from django.urls import path

from zones.views import LatestZonesAPIView, ZoneDetailAPIView

urlpatterns = [
    path("latest/", LatestZonesAPIView.as_view(), name="zones-latest"),
    path("<int:pk>/", ZoneDetailAPIView.as_view(), name="zones-detail"),
]
