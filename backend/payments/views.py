import stripe
import json
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from courses.models import Course
from .services import create_checkout_session, handle_successful_payment
from .models import Order
from .serializers import OrderSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    """L'étudiant clique 'Acheter' → on crée une session Stripe et on renvoie l'URL de paiement."""
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(pk=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response({"error": "Cours introuvable."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'STUDENT':
            return Response({"error": "Seuls les étudiants peuvent acheter un cours."},
                             status=status.HTTP_403_FORBIDDEN)

        try:
            checkout_url = create_checkout_session(course, request.user)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"checkout_url": checkout_url}, status=status.HTTP_200_OK)


class MyOrdersView(APIView):
    """Liste des commandes de l'étudiant connecté (historique d'achats)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(student=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """
    Endpoint appelé automatiquement par Stripe après un paiement.
    Vue Django pure (pas DRF) car DRF perturbe la lecture du body brut,
    ce qui fait échouer la vérification de signature Stripe.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_successful_payment(session)

    return JsonResponse({"received": True}, status=200)