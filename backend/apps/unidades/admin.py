from django.contrib import admin
from .models import UBS

admin.site.site_header = 'UBS Digital — Administração'
admin.site.site_title = 'UBS Digital'
admin.site.index_title = 'Gerenciamento das unidades de saúde'


@admin.register(UBS)
class UBSAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cnes', 'bairro', 'cep', 'ativa', 'atualizado_em')
    list_filter = ('ativa', 'bairro')
    search_fields = ('nome', 'cnes', 'bairro', 'endereco')
