from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Cria ou atualiza o único acesso Admin do ambiente local.'

    def add_arguments(self, parser):
        parser.add_argument('--password', required=True, help='Senha do Admin local.')

    def handle(self, *args, **options):
        if settings.SETTINGS_MODULE != 'config.settings.dev':
            raise CommandError('Este comando só está disponível com as configurações de desenvolvimento.')

        User = get_user_model()
        if User.objects.filter(is_superuser=True).exclude(username='Admin').exists():
            raise CommandError('Já existe outro superusuário. Revise as contas antes de criar o Admin local.')

        user, created = User.objects.get_or_create(username='Admin')
        user.first_name = 'Admin'
        user.last_name = ''
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.set_password(options['password'])
        user.save()
        action = 'criado' if created else 'atualizado'
        self.stdout.write(self.style.SUCCESS(f'Usuário Admin {action} no SQLite local.'))
