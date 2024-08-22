from django.db import models
from django.contrib.auth.models import User

class Actions(models.Model):
    name = models.CharField(max_length=500, blank = False, null = False, unique=True)

    class Meta:
        db_table = 's_actions'
        verbose_name = "Действие"
        verbose_name_plural = "Дейстивя"

    def __str__(self):
        return f'{self.name}' 
    
class Logs(models.Model):
    date   = models.DateTimeField(auto_now_add=True)
    action = models.ForeignKey(to = Actions, on_delete=models.CASCADE)
    user   = models.ForeignKey(to = User, on_delete=models.CASCADE)
    params = models.CharField(max_length=500, blank = False, null = False, unique=False)

    class Meta:
        db_table = 'd_logs'
        verbose_name = "Журнал"
        verbose_name_plural = "Журнал"

    def __str__(self):
        return f'{self.action.name}' 