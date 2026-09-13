from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os


class Command(BaseCommand):
    help = 'Create admin user if it does not exist'

    def handle(self, *args, **kwargs):

        username = os.getenv('ADMIN_USERNAME')
        password = os.getenv('ADMIN_PASSWORD')
        email = os.getenv('ADMIN_EMAIL', '')

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    'ADMIN_USERNAME or ADMIN_PASSWORD is not set.'
                )
            )
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )

        if created:
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    f'Admin user "{username}" created successfully.'
                )
            )

        else:
            self.stdout.write(
                self.style.WARNING(
                    f'Admin user "{username}" already exists.'
                )
            )
