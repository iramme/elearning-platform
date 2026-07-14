from rest_framework.permissions import BasePermission


class IsInstructor(BasePermission):
    """Autorise uniquement les instructeurs."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'INSTRUCTOR'


class IsStudent(BasePermission):
    """Autorise uniquement les étudiants."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'STUDENT'


class IsAdminRole(BasePermission):
    """Autorise uniquement les admins."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'