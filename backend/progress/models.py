from django.db import models
from django.conf import settings
from courses.models import Course, Lesson


class LessonProgress(models.Model):
    """
    Suivi de la progression d'un étudiant sur une leçon précise.
    'completed' passe à True quand l'étudiant a regardé la vidéo jusqu'au bout
    (ou dépassé un seuil, ex: 90%).
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progress'
    )
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name='progress_entries'
    )
    watched_seconds = models.PositiveIntegerField(default=0)  # dernière position regardée
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title} ({'✓' if self.completed else '…'})"


class CourseProgress(models.Model):
    """
    Résumé de la progression globale d'un étudiant sur un cours.
    Mis à jour automatiquement à chaque LessonProgress complétée.
    """
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='course_progress'
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name='student_progress'
    )
    percent_complete = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'course')

    def recalculate(self):
        """Recalcule le pourcentage de complétion en fonction des leçons terminées."""
        total_lessons = self.course.lessons.count()
        if total_lessons == 0:
            self.percent_complete = 0
        else:
            completed_lessons = LessonProgress.objects.filter(
                student=self.student,
                lesson__course=self.course,
                completed=True
            ).count()
            self.percent_complete = int((completed_lessons / total_lessons) * 100)

        was_completed = self.is_completed
        self.is_completed = self.percent_complete == 100

        if self.is_completed and not was_completed:
            from django.utils import timezone
            self.completed_at = timezone.now()

        self.save()
        return self.is_completed

    def __str__(self):
        return f"{self.student.username} - {self.course.title} ({self.percent_complete}%)"