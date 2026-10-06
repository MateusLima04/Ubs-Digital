from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
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
