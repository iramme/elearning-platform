from django.db import models
from django.conf import settings
from courses.models import Course
import uuid


class Certificate(models.Model):
    """
    Certificat généré automatiquement quand un étudiant termine un cours à 100%.
    'certificate_code' sert d'identifiant unique vérifiable publiquement
    (ex: page /verify/<code> pour prouver l'authenticité).
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates'
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='certificates'
    )
    certificate_code = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    pdf_url = models.URLField(blank=True, null=True)  # stocké sur Cloudinary
    issued_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"Certificat {self.student.username} - {self.course.title}"