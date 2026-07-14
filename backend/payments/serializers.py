from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'course', 'course_title', 'course_slug', 'amount', 'status', 'created_at', 'paid_at')
        read_only_fields = ('amount', 'status', 'created_at', 'paid_at')