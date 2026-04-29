from django.urls import path

from dashboard.views import LatestDashboardAPIView

urlpatterns = [
    path("latest/", LatestDashboardAPIView.as_view(), name="dashboard-latest"),
]
