from rest_framework import serializers
from .models import Review
from payments.models import Order


class ReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'course', 'student_name', 'rating', 'comment', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

    def validate_course(self, course):
        """Vérifie que l'étudiant a bien payé ce cours avant de pouvoir laisser un avis."""
        request = self.context['request']
        has_paid = Order.objects.filter(
            student=request.user, course=course, status='PAID'
        ).exists()
        if not has_paid:
            raise serializers.ValidationError(
                "Vous devez avoir acheté ce cours pour pouvoir le noter."
            )
        return course

    def validate(self, attrs):
        """Empêche une 2e review sur le même cours (sauf si c'est une mise à jour)."""
        request = self.context['request']
        course = attrs.get('course')
        if self.instance is None:  # création uniquement
            if Review.objects.filter(student=request.user, course=course).exists():
                raise serializers.ValidationError(
                    "Vous avez déjà laissé un avis sur ce cours. Modifiez-le plutôt."
                )
        return attrs

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)