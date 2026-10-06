from django.http import JsonResponse
from .models import UBS

def list_ubs(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Método não permitido'}, status=405)
    unidades = UBS.objects.filter(ativa=True).values(
        'id', 'nome', 'endereco', 'bairro', 'cep', 'telefone',
        'horario_funcionamento', 'latitude', 'longitude', 'ativa'
    )
    return JsonResponse([{**item, 'latitude': float(item['latitude']), 'longitude': float(item['longitude'])} for item in unidades], safe=False)
