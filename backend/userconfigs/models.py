from django.db import models
from django.contrib.auth.models import User
from directories.models import Invertors

class UserInvConfigs(models.Model):
    user = models.ForeignKey(to = User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    invertor = models.ForeignKey(to = Invertors, on_delete=models.CASCADE)
    options = models.TextField(max_length = 4000, blank = True, null = True, unique = False)
    staff_opened = models.BooleanField(default = False, null = True, blank = True)

    class Meta:
        db_table = 'd_user_inv_config'
        verbose_name = "Конфигурация ПЧ пользователя"
        verbose_name_plural = "Конфигурации ПЧ пользователя"

    def __str__(self):
        return f'{self.date}'