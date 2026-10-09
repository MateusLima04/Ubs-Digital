"""Inicializador simples do backend local do UBS Digital.

Uso:
    python server.py
"""

import os
import subprocess
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / 'db.sqlite3'
CSV_SOURCE = BASE_DIR / 'data' / 'ubs_recife.csv'


def restart_with_virtualenv():
    candidates = (
        BASE_DIR / '.venv' / 'Scripts' / 'python.exe',
        BASE_DIR / '.venv' / 'bin' / 'python',
    )
    current_python = Path(sys.executable).resolve()
    virtualenv_python = next((path for path in candidates if path.exists()), None)
    if virtualenv_python and virtualenv_python.resolve() != current_python:
        return subprocess.call([str(virtualenv_python), str(Path(__file__).resolve()), *sys.argv[1:]])
    return None


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

    try:
        import django
        from django.core.management import call_command, execute_from_command_line
    except ImportError:
        exit_code = restart_with_virtualenv()
        if exit_code is not None:
            raise SystemExit(exit_code)
        raise SystemExit(
            'Django não está instalado. Prepare o projeto uma vez com: '
            'python -m venv .venv e .venv\\Scripts\\python.exe -m pip install -r requirements.txt'
        )

    first_run = not DATABASE.exists()
    django.setup()

    if os.getenv('RUN_MAIN') != 'true':
        print('Preparando o banco de dados...')
        call_command('migrate', interactive=False, verbosity=0)

        if first_run:
            print('Importando as unidades de saúde...')
            call_command('importar_ubs', str(CSV_SOURCE), verbosity=0)

        print('UBS Digital disponível em http://127.0.0.1:8000')
    execute_from_command_line([sys.argv[0], 'runserver', '0.0.0.0:8000'])


if __name__ == '__main__':
    main()
