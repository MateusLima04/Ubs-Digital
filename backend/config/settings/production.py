import os
from django.core.exceptions import ImproperlyConfigured
from .base import *

DEBUG = False
if SECRET_KEY == 'dev-only-unsafe-change-in-production' or not os.getenv('DATABASE_URL'):
    raise ImproperlyConfigured('Configure DJANGO_SECRET_KEY e DATABASE_URL em produção.')
SECURE_SSL_REDIRECT = os.getenv('DJANGO_SECURE_SSL_REDIRECT', 'true').lower() == 'true'
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
