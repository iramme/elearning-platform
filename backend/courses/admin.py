from django.contrib import admin
from .models import Category, Course, Lesson, Resource


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'category', 'price', 'is_published', 'created_at')
    list_filter = ('is_published', 'level', 'category')
    search_fields = ('title', 'instructor__username')
    inlines = [LessonInline]


admin.site.register(Category)
admin.site.register(Resource)