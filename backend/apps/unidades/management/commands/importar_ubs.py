import csv
from decimal import Decimal, InvalidOperation
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.unidades.models import UBS


def title_bairro(value):
    return ' '.join(word.lower() if index and word.lower() in {'da', 'de', 'do', 'das', 'dos'} else word.capitalize()
                    for index, word in enumerate(value.split()))


class Command(BaseCommand):
    help = 'Importa o CSV original de UBSs do Recife (separador ;) ou o formato simples (separador ,).'

    def add_arguments(self, parser):
        parser.add_argument('caminho')

    def handle(self, *args, **options):
        path = Path(options['caminho'])
        if not path.is_file():
            raise CommandError(f'Arquivo não encontrado: {path}')
        count = 0
        with path.open(newline='', encoding='utf-8-sig') as file:
            header = file.readline()
            file.seek(0)
            original = 'nome_oficial' in header
            reader = csv.DictReader(file, delimiter=';' if original else ',')
            required = {'nome_oficial', 'endereço', 'bairro', 'latitude', 'longitude'} if original else {'nome', 'endereco', 'bairro', 'latitude', 'longitude'}
            if not reader.fieldnames or not required.issubset(reader.fieldnames):
                raise CommandError('Cabeçalhos de UBS ausentes ou não reconhecidos.')
            with transaction.atomic():
                for line, row in enumerate(reader, 2):
                    try:
                        nome = row['nome_oficial' if original else 'nome'].strip()
                        endereco = row['endereço' if original else 'endereco'].strip()
                        bairro = row['bairro'].strip()
                        latitude = Decimal(row['latitude'].strip().replace(',', '.'))
                        longitude = Decimal(row['longitude'].strip().replace(',', '.'))
                        if not all((nome, endereco, bairro)) or not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                            raise ValueError('campos obrigatórios vazios ou coordenadas fora do intervalo')
                        cnes = row.get('cnes', '').strip()
                        defaults = {
                            'cnes': cnes,
                            'nome': nome,
                            'endereco': endereco,
                            'bairro': title_bairro(bairro),
                            'cep': row.get('cep', '').strip(),
                            'telefone': row.get('fone' if original else 'telefone', '').strip(),
                            'horario_funcionamento': row.get('horario' if original else 'horario_funcionamento', '').strip(),
                            'especialidade': row.get('especialidade', '').strip(),
                            'como_usar': row.get('como_usar', '').strip(),
                            'rpa': row.get('rpa', '').strip(),
                            'latitude': latitude,
                            'longitude': longitude,
                            'ativa': row.get('ativa', 'true').strip().lower() in ('true', '1', 'sim', 's'),
                        }
                        key = {'cnes': cnes} if cnes else {'nome': nome, 'endereco': endereco}
                        UBS.objects.update_or_create(defaults=defaults, **key)
                        count += 1
                    except (ValueError, InvalidOperation, KeyError, TypeError) as error:
                        raise CommandError(f'Linha {line}: {error}') from error
        self.stdout.write(self.style.SUCCESS(f'{count} UBS(s) importada(s).'))
