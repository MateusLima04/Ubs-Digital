from django.contrib.auth import authenticate, get_user_model
from django.core.management import call_command
from django.test import TestCase


class LocalAdminTests(TestCase):
    def test_creates_one_admin_with_requested_name_and_hashed_password(self):
        call_command('criar_admin_local', password='admin123', verbosity=0)
        call_command('criar_admin_local', password='admin123', verbosity=0)
        users = get_user_model().objects.all()
        self.assertEqual(users.count(), 1)
        user = users.get()
        self.assertEqual(user.username, 'Admin')
        self.assertEqual(user.first_name, 'Admin')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertNotEqual(user.password, 'admin123')
        self.assertIsNotNone(authenticate(username='Admin', password='admin123'))
        self.assertTrue(self.client.login(username='Admin', password='admin123'))
        self.assertEqual(self.client.get('/admin/').status_code, 200)
