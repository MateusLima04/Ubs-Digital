from django.contrib import admin
from .models import UBS

@admin.register(UBS)
class UBSAdmin(admin.ModelAdmin):
    list_display = ('nome', 'bairro', 'cep', 'ativa', 'atualizado_em')
    list_filter = ('ativa', 'bairro')
    search_fields = ('nome', 'bairro', 'endereco')
