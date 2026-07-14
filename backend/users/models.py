from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé.
    On étend AbstractUser (qui contient déjà username, email, password, etc.)
    et on ajoute un champ 'role' pour gérer les 3 types d'utilisateurs.
    """

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        INSTRUCTOR = 'INSTRUCTOR', 'Instructeur'
        STUDENT = 'STUDENT', 'Étudiant'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.STUDENT
    )
    bio = models.TextField(blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)  # URL Cloudinary plus tard
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def is_instructor(self):
        return self.role == self.Role.INSTRUCTOR

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN