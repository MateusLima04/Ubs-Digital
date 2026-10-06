from django.db import models

class UBS(models.Model):
    nome = models.CharField(max_length=180)
    endereco = models.CharField(max_length=255)
    bairro = models.CharField(max_length=120)
    cep = models.CharField(max_length=9)
    telefone = models.CharField(max_length=30, blank=True)
    horario_funcionamento = models.CharField(max_length=160, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    ativa = models.BooleanField(default=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'UBS'
        verbose_name_plural = 'UBSs'
        ordering = ['nome']

    def __str__(self):
        return self.nome
