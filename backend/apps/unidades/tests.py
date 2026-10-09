from decimal import Decimal
from pathlib import Path
from django.conf import settings
from django.core.management import call_command
from django.test import TestCase
from .models import UBS

class UBSTests(TestCase):
    def setUp(self):
        UBS.objects.create(nome='USF Teste', endereco='Rua Um, 10', bairro='Pina', cep='51000-000', latitude=Decimal('-8.0800000'), longitude=Decimal('-34.8800000'))
        UBS.objects.create(nome='USF Inativa', endereco='Rua Dois, 20', bairro='Pina', cep='51000-001', latitude=Decimal('-8.0810000'), longitude=Decimal('-34.8810000'), ativa=False)

    def test_api_lists_only_active_with_numeric_coordinates(self):
        response = self.client.get('/api/ubs/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['nome'], 'USF Teste')
        self.assertIsInstance(data[0]['latitude'], float)

    def test_api_rejects_post(self):
        self.assertEqual(self.client.post('/api/ubs/').status_code, 405)

    def test_imports_original_csv_idempotently(self):
        source = Path(settings.BASE_DIR) / 'data' / 'ubs_recife.csv'
        call_command('importar_ubs', str(source), verbosity=0)
        self.assertEqual(UBS.objects.exclude(cnes='').count(), 22)
        call_command('importar_ubs', str(source), verbosity=0)
        self.assertEqual(UBS.objects.exclude(cnes='').count(), 22)
        unit = UBS.objects.get(cnes='0002143')
        self.assertIn('César', unit.nome)
        self.assertEqual(unit.cep, '')
