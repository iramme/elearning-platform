from django.urls import path
from .views import MyCertificatesView, VerifyCertificateView

urlpatterns = [
    path('my-certificates/', MyCertificatesView.as_view(), name='my-certificates'),
    path('verify/<uuid:code>/', VerifyCertificateView.as_view(), name='verify-certificate'),
]