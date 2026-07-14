from rest_framework import serializers
from .models import LessonProgress, CourseProgress


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ('id', 'lesson', 'watched_seconds', 'completed', 'completed_at')
        read_only_fields = ('completed_at',)


class CourseProgressSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)

    class Meta:
        model = CourseProgress
        fields = ('id', 'course', 'course_title', 'course_slug', 'percent_complete', 'is_completed', 'completed_at')