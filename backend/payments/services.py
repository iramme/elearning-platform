import stripe
from django.conf import settings
from .models import Order

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(course, student):
    """
    Crée une session de paiement Stripe Checkout pour un cours.
    Retourne l'URL vers laquelle rediriger l'étudiant.
    """
    # Empêche un ré-achat si déjà payé
    if Order.objects.filter(student=student, course=course, status=Order.Status.PAID).exists():
        raise ValueError("Vous avez déjà acheté ce cours.")

    # Crée (ou récupère) une commande PENDING
    order, _ = Order.objects.get_or_create(
        student=student,
        course=course,
        status=Order.Status.PENDING,
        defaults={'amount': course.price}
    )

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': course.title,
                    'description': course.description[:200],
                },
                'unit_amount': int(course.price * 100),  # Stripe travaille en centimes
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{settings.FRONTEND_URL}/checkout/cancel",
        metadata={
            'order_id': str(order.id),
            'course_id': str(course.id),
            'student_id': str(student.id),
        }
    )

    order.stripe_session_id = session.id
    order.save()

    return session.url


def handle_successful_payment(session):
    """
    Appelé par le webhook quand Stripe confirme le paiement.
    Marque la commande comme PAID.
    """
    metadata = session['metadata']
    order_id = metadata['order_id']  # accès direct, pas .get()

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return None

    order.status = Order.Status.PAID
    order.stripe_payment_intent = session['payment_intent']  # idem, accès direct
    from django.utils import timezone
    order.paid_at = timezone.now()
    order.save()

    return order