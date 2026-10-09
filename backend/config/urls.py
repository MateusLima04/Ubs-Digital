from django.http import FileResponse, Http404
from django.urls import path, re_path
from django.conf import settings
from apps.unidades.views import list_ubs

def frontend(request):
    index = settings.BASE_DIR.parent / 'frontend' / 'dist' / 'index.html'
    if not index.exists():
        raise Http404('O frontend ainda não foi compilado.')
    return FileResponse(index.open('rb'), content_type='text/html')

def frontend_asset(request, asset):
    import mimetypes
    root = (settings.BASE_DIR.parent / 'frontend' / 'dist').resolve()
    file = (root / asset).resolve()
    if not file.is_relative_to(root) or not file.is_file():
        raise Http404()
    return FileResponse(file.open('rb'), content_type=mimetypes.guess_type(file.name)[0] or 'application/octet-stream')

urlpatterns = [
    path('api/ubs/', list_ubs),
    re_path(r'^(?P<asset>assets/[^?]+|icons/[^?]+|manifest\.webmanifest|sw\.js)$', frontend_asset),
    path('', frontend),
]
