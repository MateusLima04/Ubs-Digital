import csv
from decimal import Decimal, InvalidOperation
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from apps.unidades.models import UBS

REQUIRED = {'nome', 'endereco', 'bairro', 'cep', 'latitude', 'longitude'}

class Command(BaseCommand):
    help = 'Importa UBSs de um CSV UTF-8 com cabeçalhos nome,endereco,bairro,cep,telefone,horario_funcionamento,latitude,longitude,ativa.'

    def add_arguments(self, parser):
        parser.add_argument('caminho')

    def handle(self, *args, **options):
        path = Path(options['caminho'])
        if not path.is_file():
            raise CommandError(f'Arquivo não encontrado: {path}')
        count = 0
        with path.open(newline='', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            if not reader.fieldnames or not REQUIRED.issubset(reader.fieldnames):
                raise CommandError('Cabeçalhos obrigatórios: ' + ', '.join(sorted(REQUIRED)))
            with transaction.atomic():
                for line, row in enumerate(reader, 2):
                    try:
                        latitude = Decimal(row['latitude'].replace(',', '.'))
                        longitude = Decimal(row['longitude'].replace(',', '.'))
                        if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                            raise ValueError('coordenadas fora do intervalo')
                        if not all(row.get(key, '').strip() for key in REQUIRED):
                            raise ValueError('campo obrigatório vazio')
                        UBS.objects.update_or_create(
                            nome=row['nome'].strip(), endereco=row['endereco'].strip(),
                            defaults={
                                'bairro': row['bairro'].strip(), 'cep': row['cep'].strip(),
                                'telefone': row.get('telefone', '').strip(),
                                'horario_funcionamento': row.get('horario_funcionamento', '').strip(),
                                'latitude': latitude, 'longitude': longitude,
                                'ativa': row.get('ativa', 'true').strip().lower() in ('true', '1', 'sim', 's'),
                            },
                        )
                        count += 1
                    except (ValueError, InvalidOperation, KeyError, TypeError) as error:
                        raise CommandError(f'Linha {line}: {error}') from error
        self.stdout.write(self.style.SUCCESS(f'{count} UBS(s) importada(s).'))
