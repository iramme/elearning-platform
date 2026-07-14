from rest_framework import serializers
from .models import Category, Course, Lesson, Resource


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug')


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ('id', 'title', 'file_url', 'file_public_id')
        read_only_fields = ('file_public_id',)


class LessonSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = (
            'id', 'course', 'title', 'description', 'video_url',
            'video_public_id', 'duration_seconds', 'order',
            'is_free_preview', 'resources'
        )
        read_only_fields = ('video_public_id', 'course')


class LessonPublicSerializer(serializers.ModelSerializer):
    """
    Version 'light' pour les étudiants qui n'ont PAS encore payé le cours.
    Cache l'URL vidéo sauf si c'est une preview gratuite.
    """
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'title', 'description', 'duration_seconds', 'order',
                   'is_free_preview', 'video_url')

    def get_video_url(self, obj):
        if obj.is_free_preview:
            return obj.video_url
        return None  # verrouillé tant que non payé


class CourseListSerializer(serializers.ModelSerializer):
    """Version résumée pour l'affichage en liste (catalogue public)."""
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    total_students = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'slug', 'thumbnail', 'price', 'level',
            'instructor_name', 'category_name', 'average_rating',
            'total_students', 'is_published'
        )


class CourseDetailSerializer(serializers.ModelSerializer):
    """Version complète pour la page détail d'un cours."""
    instructor_name = serializers.CharField(source='instructor.username', read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    lessons = serializers.SerializerMethodField()
    average_rating = serializers.ReadOnlyField()
    total_students = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'slug', 'description', 'thumbnail', 'price',
            'level', 'category', 'category_id', 'instructor_name',
            'is_published', 'lessons', 'average_rating', 'total_students',
            'created_at'
        )
        read_only_fields = ('slug',)

    def get_lessons(self, obj):
        """
        Affiche les leçons complètes si l'utilisateur a payé OU est l'instructeur.
        Sinon, version verrouillée (sauf previews gratuites).
        """
        request = self.context.get('request')
        user = request.user if request else None

        has_access = False
        if user and user.is_authenticated:
            if user == obj.instructor or user.role == 'ADMIN':
                has_access = True
            else:
                has_access = obj.orders.filter(student=user, status='PAID').exists()

        lessons = obj.lessons.all()
        if has_access:
            return LessonSerializer(lessons, many=True).data
        return LessonPublicSerializer(lessons, many=True).data


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer dédié à la création/modification par l'instructeur."""

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'slug', 'description', 'thumbnail', 'price',
            'level', 'category', 'is_published'
        )
        read_only_fields = ('slug',)

    def create(self, validated_data):
        # L'instructeur est automatiquement celui qui fait la requête
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)