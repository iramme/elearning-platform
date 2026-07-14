from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Category(models.Model):
    """Catégorie de cours (ex: Développement Web, Design, Marketing...)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Course(models.Model):
    """
    Un cours créé par un instructeur.
    Contient les infos générales — les vidéos sont dans le modèle Lesson.
    """

    class Level(models.TextChoices):
        BEGINNER = 'BEGINNER', 'Débutant'
        INTERMEDIATE = 'INTERMEDIATE', 'Intermédiaire'
        ADVANCED = 'ADVANCED', 'Avancé'

    instructor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses',
        limit_choices_to={'role': 'INSTRUCTOR'}
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name='courses'
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    thumbnail = models.URLField(blank=True, null=True)  # image Cloudinary
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def average_rating(self):
        """Calcule la note moyenne à partir des reviews liées."""
        reviews = self.reviews.all()
        if not reviews.exists():
            return 0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    @property
    def total_students(self):
        return self.orders.filter(status='PAID').count()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']


class Lesson(models.Model):
    """
    Une leçon (vidéo) appartenant à un cours.
    L'ordre détermine la position dans la playlist du cours.
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_url = models.URLField()          # URL Cloudinary de la vidéo
    video_public_id = models.CharField(max_length=255, blank=True)  # pour suppression Cloudinary
    duration_seconds = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    is_free_preview = models.BooleanField(default=False)  # leçon gratuite pour teaser
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"

    class Meta:
        ordering = ['order']


class Resource(models.Model):
    """Ressource téléchargeable liée à une leçon (PDF, code source, etc.)."""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='resources')
    title = models.CharField(max_length=200)
    file_url = models.URLField()           # URL Cloudinary du fichier
    file_public_id = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title