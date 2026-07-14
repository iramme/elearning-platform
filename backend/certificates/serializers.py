from rest_framework import serializers
from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Certificate
        fields = ('id', 'course_title', 'student_name', 'certificate_code', 'pdf_url', 'issued_at')