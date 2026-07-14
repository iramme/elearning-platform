from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'inscription.
    On valide le mot de passe et on autorise le choix du rôle
    (étudiant ou instructeur — l'admin est créé manuellement).
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        if attrs.get('role') == User.Role.ADMIN:
            raise serializers.ValidationError({"role": "Impossible de s'inscrire en tant qu'admin."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', User.Role.STUDENT),
            password=validated_data['password'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour afficher/mettre à jour le profil utilisateur."""

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'bio', 'avatar', 'created_at')
        read_only_fields = ('id', 'role', 'created_at')