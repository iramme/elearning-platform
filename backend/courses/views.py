from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Course, Lesson
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseCreateUpdateSerializer, LessonSerializer
)
from .permissions import IsInstructorOwnerOrReadOnly

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Course, Lesson, Resource
from .services import (
    upload_video_to_cloudinary,
    upload_resource_to_cloudinary,
    upload_thumbnail_to_cloudinary,
    delete_from_cloudinary,
)


class LessonVideoUploadView(APIView):
    """
    Upload d'une vidéo pour une leçon existante.
    Remplace l'ancienne vidéo si elle existe déjà (et la supprime de Cloudinary).
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Leçon introuvable."}, status=status.HTTP_404_NOT_FOUND)

        # Sécurité : seul l'instructeur propriétaire peut uploader
        if lesson.course.instructor != request.user:
            return Response({"error": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)

        video_file = request.FILES.get('video')
        if not video_file:
            return Response({"error": "Aucun fichier vidéo fourni."}, status=status.HTTP_400_BAD_REQUEST)

        # Supprime l'ancienne vidéo si elle existe
        if lesson.video_public_id:
            delete_from_cloudinary(lesson.video_public_id, resource_type="video")

        result = upload_video_to_cloudinary(video_file)
        lesson.video_url = result['url']
        lesson.video_public_id = result['public_id']
        if result['duration']:
            lesson.duration_seconds = result['duration']
        lesson.save()

        return Response({
            "message": "Vidéo uploadée avec succès.",
            "video_url": lesson.video_url,
            "duration_seconds": lesson.duration_seconds
        }, status=status.HTTP_200_OK)


class LessonResourceUploadView(APIView):
    """Upload d'une ressource (PDF, ZIP...) liée à une leçon."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, lesson_id):
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Leçon introuvable."}, status=status.HTTP_404_NOT_FOUND)

        if lesson.course.instructor != request.user:
            return Response({"error": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)

        file = request.FILES.get('file')
        title = request.data.get('title', file.name if file else '')
        if not file:
            return Response({"error": "Aucun fichier fourni."}, status=status.HTTP_400_BAD_REQUEST)

        result = upload_resource_to_cloudinary(file)
        resource = Resource.objects.create(
            lesson=lesson,
            title=title,
            file_url=result['url'],
            file_public_id=result['public_id']
        )

        return Response({
            "id": resource.id,
            "title": resource.title,
            "file_url": resource.file_url
        }, status=status.HTTP_201_CREATED)


class CourseThumbnailUploadView(APIView):
    """Upload de l'image de couverture d'un cours."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, course_id):
        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response({"error": "Cours introuvable."}, status=status.HTTP_404_NOT_FOUND)

        if course.instructor != request.user:
            return Response({"error": "Non autorisé."}, status=status.HTTP_403_FORBIDDEN)

        image_file = request.FILES.get('thumbnail')
        if not image_file:
            return Response({"error": "Aucune image fournie."}, status=status.HTTP_400_BAD_REQUEST)

        result = upload_thumbnail_to_cloudinary(image_file)
        course.thumbnail = result['url']
        course.save()

        return Response({
            "message": "Thumbnail uploadée avec succès.",
            "thumbnail": course.thumbnail
        }, status=status.HTTP_200_OK)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Liste des catégories — lecture seule, publique."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CourseViewSet(viewsets.ModelViewSet):
    """
    CRUD complet des cours.
    - Liste/détail : public
    - Création/modif/suppression : instructeur propriétaire uniquement
    """
    queryset = Course.objects.all()
    permission_classes = [IsInstructorOwnerOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'level', 'is_published']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        qs = Course.objects.all()
        # Le grand public ne voit que les cours publiés
        if not self.request.user.is_authenticated or self.request.user.role == 'STUDENT':
            return qs.filter(is_published=True)
        # L'instructeur voit aussi ses propres cours non publiés
        if self.request.user.role == 'INSTRUCTOR':
            from django.db.models import Q
            return qs.filter(Q(is_published=True) | Q(instructor=self.request.user))
        return qs  # Admin voit tout

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        if self.action in ('create', 'update', 'partial_update'):
            return CourseCreateUpdateSerializer
        return CourseDetailSerializer

    def get_serializer_context(self):
        return {'request': self.request}


class LessonViewSet(viewsets.ModelViewSet):
    """
    Gestion des leçons d'un cours.
    Seul l'instructeur propriétaire du cours parent peut créer/modifier.
    """
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs.get('course_slug'))

    def perform_create(self, serializer):
        from .models import Course
        course = Course.objects.get(pk=self.kwargs.get('course_slug'))
        if course.instructor != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Vous n'êtes pas l'instructeur de ce cours.")
        serializer.save(course=course)