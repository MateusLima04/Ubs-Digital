# UBS Digital

Aplicação acadêmica para explorar Unidades Básicas de Saúde no Recife. A primeira etapa funciona inteiramente no navegador, com nove unidades **fictícias**. Os endereços, telefones e horários são ilustrativos e não devem ser usados para buscar atendimento real.

## Estrutura

```text
frontend/  React 19, Vite, JavaScript, Leaflet, PWA e JSON de demonstração
backend/   Django, modelo UBS, Admin, API e importador CSV
```

O frontend acessa unidades apenas por `src/services/ubsService.js`. Com `VITE_DEMO_MODE=true` (padrão, inclusive sem `.env`), o serviço lê o JSON local. Com `VITE_DEMO_MODE=false`, chama `GET /api/ubs/` no Django. A localização é mantida somente na memória da aba; apenas o primeiro nome informado é salvo no `localStorage`. O usuário também pode entrar como visitante.

## Rodar a demonstração, sem banco e sem Django

Requer Node.js e npm. No Windows com PowerShell que bloqueia `npm.ps1`, use `npm.cmd`.

```bash
cd frontend
npm install
npm run dev
```

Abra a URL exibida pelo Vite, normalmente `http://localhost:5173`. O navegador pedirá permissão ao clicar em **Usar minha localização**. Geolocalização exige `localhost` ou HTTPS. O mapa usa tiles do OpenStreetMap e, portanto, precisa de internet. A interface e o JSON podem ficar em cache pelo service worker na versão compilada; mapas inteiros não são armazenados.

## Testes e build do frontend

```bash
cd frontend
npm test
npm run build
npm run preview
```

O PWA instala quando o navegador oferecer o evento de instalação, em `localhost` ou HTTPS. O service worker é registrado apenas no build de produção. Os ícones SVG estão em `frontend/public/icons/`.

## Rodar o backend

Requer Python 3.12 ou superior. Crie um ambiente virtual e instale as dependências:

```bash
cd backend
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

No Windows, se a ativação estiver bloqueada, execute `.venv\Scripts\python.exe manage.py runserver`. O ambiente de desenvolvimento usa SQLite por padrão. O backend não precisa estar ligado para a demonstração. A API lista apenas UBSs ativas; inicialmente retorna lista vazia até uma importação.

Para usar a API no frontend, configure `frontend/.env`:

```env
VITE_DEMO_MODE=false
VITE_API_BASE_URL=
```

No desenvolvimento, o proxy do Vite encaminha `/api` para `http://127.0.0.1:8000`. Se o backend estiver em outra origem, use `VITE_API_BASE_URL` com essa origem e configure CORS no Django antes de publicar. Reinicie o Vite após alterar `.env`.

## Importar unidades por CSV

O arquivo deve ser UTF-8 com cabeçalhos `nome,endereco,bairro,cep,telefone,horario_funcionamento,latitude,longitude,ativa`. Os seis campos obrigatórios são nome, endereço, bairro, CEP, latitude e longitude. `ativa` aceita `true`, `1`, `sim` ou `s`; omitir equivale a ativa. A importação atualiza por nome + endereço e é atômica.

```bash
cd backend
python manage.py importar_ubs caminho/arquivo.csv
```

O arquivo `backend/exemplo_ubs.csv` mostra o formato, com dados fictícios.

## Etapa futura: Django + Supabase Postgres

Fluxo planejado: React → API Django → Supabase Postgres. O React não acessa o banco diretamente. Configure `DATABASE_URL` e `DJANGO_SECRET_KEY` apenas no ambiente do servidor, tomando `backend/.env.example` como guia. O Django lê variáveis de ambiente; o arquivo `.env` não é carregado automaticamente. Para produção, defina `DJANGO_SETTINGS_MODULE=config.settings.production`, `DJANGO_ALLOWED_HOSTS` e `DJANGO_CSRF_TRUSTED_ORIGINS`, aplique migrações e use HTTPS. A autenticação futura poderá usar o sistema de usuários e senhas com hash do Django, e ainda não está implementada.

Para um backend persistente, consulte a [documentação de conexões do Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres) para escolher conexão direta ou pooler de sessão conforme a rede. Nenhuma credencial ou banco real faz parte deste repositório.

O Django já oferece uma rota para servir o `frontend/dist` após `npm run build`; copie essa pasta junto com o backend ao implantar os dois na mesma hospedagem. Gere o build, configure o servidor WSGI e rode `python manage.py collectstatic` para estáticos do Django Admin. Essa hospedagem conjunta ainda não foi implantada.

## Verificações do backend

```bash
cd backend
python manage.py test
python manage.py check
```

## Privacidade e limites

- A localização é usada apenas no navegador, para cálculo de distância por Haversine. Não é persistida nem enviada à API.
- A distância é aproximada em linha reta, não tempo ou percurso de viagem.
- A rota abre o Google Maps em outra aba com as coordenadas da unidade.
- Não são coletados CPF, Cartão SUS, prontuários nem dados de saúde.
