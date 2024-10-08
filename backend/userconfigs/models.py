from django.db import models
from django.contrib.auth.models import User
from directories.models import Invertors

class UserInvConfigs(models.Model):
    user = models.ForeignKey(to = User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    invertor = models.ForeignKey(to = Invertors, on_delete=models.CASCADE)
    invertor_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    invertor_discount = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    info = models.CharField(max_length = 4000, blank = True, null = True, unique = False)

    options = models.TextField(max_length = 4000, blank = True, null = True, unique = False) 
    options_prices = models.TextField(max_length = 4000, blank = True, null = True, unique = False) 
    options_disccounts = models.TextField(max_length = 4000, blank = True, null = True, unique = False) 
    staff_opened = models.BooleanField(default = False, null = True, blank = True)

    class Meta:
        db_table = 'd_user_inv_config'
        verbose_name = "Конфигурация ПЧ пользователя"
        verbose_name_plural = "Конфигурации ПЧ пользователя"

    def __str__(self):
        return f'{self.date}'