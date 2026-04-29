from django.urls import path

from reports.views import GenerateReportAPIView, ReportListAPIView

urlpatterns = [
    path("", ReportListAPIView.as_view(), name="reports-list"),
    path("generate/", GenerateReportAPIView.as_view(), name="reports-generate"),
]
