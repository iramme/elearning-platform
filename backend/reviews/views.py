from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsReviewOwnerOrReadOnly


class ReviewViewSet(viewsets.ModelViewSet):
    """
    CRUD des avis.
    - Liste/détail : public (SAFE_METHODS)
    - Création : étudiant connecté ayant payé le cours
    - Modification/suppression : uniquement l'auteur de la review
    """
    serializer_class = ReviewSerializer
    permission_classes = [IsReviewOwnerOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        course_id = self.request.query_params.get('course')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def get_serializer_context(self):
        return {'request': self.request}