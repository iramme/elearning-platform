from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Certificate
from .serializers import CertificateSerializer


class MyCertificatesView(APIView):
    """Liste des certificats obtenus par l'étudiant connecté."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        certificates = Certificate.objects.filter(student=request.user)
        serializer = CertificateSerializer(certificates, many=True)
        return Response(serializer.data)


class VerifyCertificateView(APIView):
    """
    Vérification publique d'un certificat via son code unique.
    Utile pour qu'un recruteur/client vérifie l'authenticité d'un certificat.
    """
    permission_classes = [AllowAny]

    def get(self, request, code):
        try:
            certificate = Certificate.objects.get(certificate_code=code)
        except Certificate.DoesNotExist:
            return Response({"valid": False, "error": "Certificat introuvable."},
                             status=status.HTTP_404_NOT_FOUND)

        serializer = CertificateSerializer(certificate)
        return Response({"valid": True, "certificate": serializer.data})