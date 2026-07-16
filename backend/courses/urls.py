from django.urls import path, include
from rest_framework_nested import routers
from .views import (
    CategoryViewSet, CourseViewSet, LessonViewSet,
    LessonVideoUploadView, LessonResourceUploadView, CourseThumbnailUploadView,
    AttachVideoToLessonView
)

router = routers.SimpleRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('courses', CourseViewSet, basename='course')

courses_router = routers.NestedSimpleRouter(router, 'courses', lookup='course')
courses_router.register('lessons', LessonViewSet, basename='course-lessons')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(courses_router.urls)),
    path('lessons/<int:lesson_id>/upload-video/', LessonVideoUploadView.as_view(), name='upload-video'),
    path('lessons/<int:lesson_id>/upload-resource/', LessonResourceUploadView.as_view(), name='upload-resource'),
    path('courses/<int:course_id>/upload-thumbnail/', CourseThumbnailUploadView.as_view(), name='upload-thumbnail'),
    path('lessons/<int:lesson_id>/attach-video/', AttachVideoToLessonView.as_view(), name='attach-video'),

]