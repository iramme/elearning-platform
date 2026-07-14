from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsReviewOwnerOrReadOnly(BasePermission):
    """Tout le monde peut lire les avis. Seul l'auteur peut modifier/supprimer le sien."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.student == request.user