from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os


class Command(BaseCommand):
    help = 'Create or update admin user'

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
            username=username
        )

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True

        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Admin user "{username}" created successfully.'
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f'Admin user "{username}" updated successfully.'
                )
            )
