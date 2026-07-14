from django.core.management.base import BaseCommand
from decouple import config
from users.models import User


class Command(BaseCommand):
    help = "Crée un superuser automatiquement si aucun n'existe encore, à partir des variables d'environnement."

    def handle(self, *args, **kwargs):
        username = config('ADMIN_USERNAME', default=None)
        email = config('ADMIN_EMAIL', default='admin@example.com')
        password = config('ADMIN_PASSWORD', default=None)

        if not username or not password:
            self.stdout.write("ADMIN_USERNAME ou ADMIN_PASSWORD non défini, superuser non créé.")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write(f"Le superuser '{username}' existe déjà.")
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role='ADMIN'
        )
        self.stdout.write(f"Superuser '{username}' créé avec succès.")