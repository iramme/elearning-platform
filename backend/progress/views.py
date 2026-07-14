from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from courses.models import Lesson, Course
from payments.models import Order
from .models import LessonProgress, CourseProgress
from .serializers import CourseProgressSerializer


class UpdateLessonProgressView(APIView):
    """
    Sauvegarde la progression vidéo d'un étudiant (appelé régulièrement
    par le frontend pendant la lecture, ex: toutes les 10 secondes).
    Marque la leçon comme complétée si watched_seconds >= 90% de la durée.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Leçon introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # Sécurité : l'étudiant doit avoir payé le cours (sauf preview gratuite)
        has_access = lesson.is_free_preview or Order.objects.filter(
            student=request.user, course=lesson.course, status='PAID'
        ).exists()
        if not has_access:
            return Response({"error": "Accès non autorisé à cette leçon."},
                             status=status.HTTP_403_FORBIDDEN)

        watched_seconds = int(request.data.get('watched_seconds', 0))

        progress, _ = LessonProgress.objects.get_or_create(
            student=request.user, lesson=lesson
        )
        progress.watched_seconds = max(progress.watched_seconds, watched_seconds)

        # Seuil de complétion : 90% de la vidéo regardée
        if lesson.duration_seconds > 0:
            threshold = lesson.duration_seconds * 0.9
            if watched_seconds >= threshold and not progress.completed:
                progress.completed = True
                from django.utils import timezone
                progress.completed_at = timezone.now()

        progress.save()

        # Met à jour la progression globale du cours
        course_progress, _ = CourseProgress.objects.get_or_create(
            student=request.user, course=lesson.course
        )
        just_completed = course_progress.recalculate()

        # Si le cours vient d'être terminé à 100%, on génère le certificat
        if just_completed:
            from certificates.services import generate_certificate
            generate_certificate(request.user, lesson.course)

        return Response({
            "lesson_completed": progress.completed,
            "course_percent": course_progress.percent_complete,
            "course_completed": course_progress.is_completed
        }, status=status.HTTP_200_OK)


class MyCourseProgressView(APIView):
    """Liste de la progression de l'étudiant sur tous ses cours."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = CourseProgress.objects.filter(student=request.user)
        serializer = CourseProgressSerializer(progress, many=True)
        return Response(serializer.data)