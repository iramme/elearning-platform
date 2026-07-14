from django.db import models
from django.conf import settings
from courses.models import Course


class Order(models.Model):
    """
    Représente une commande/achat d'un cours par un étudiant.
    Créée en statut PENDING au moment du checkout, passe à PAID via le webhook Stripe.
    """

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'En attente'
        PAID = 'PAID', 'Payé'
        FAILED = 'FAILED', 'Échoué'
        CANCELLED = 'CANCELLED', 'Annulé'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders'
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='orders'
    )
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    stripe_session_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        # Empêche un étudiant d'acheter 2 fois le même cours
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'course'],
                condition=models.Q(status='PAID'),
                name='unique_paid_order_per_course'
            )
        ]

    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.status})"