from django.urls import path
from .views import UpdateLessonProgressView, MyCourseProgressView

urlpatterns = [
    path('lessons/<int:lesson_id>/', UpdateLessonProgressView.as_view(), name='update-progress'),
    path('my-progress/', MyCourseProgressView.as_view(), name='my-progress'),
]