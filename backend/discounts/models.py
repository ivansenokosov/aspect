from django.db import models
from directories.models import Inv_series, Type_of_options
from django.contrib.auth.models import User

class InvDisountGroup(models.Model):
    name = models.CharField(max_length=500, blank = True, null = True, verbose_name='Наименование')

class InvSerieDisount(models.Model):
    group = models.ForeignKey(to = InvDisountGroup, on_delete=models.CASCADE)
    serie = models.ForeignKey(to = Inv_series, on_delete=models.CASCADE)
    discount = models.DecimalField(decimal_places = 2, max_digits = 6, blank = False, null = False)

class InvOptionDisount(models.Model):
    group = models.ForeignKey(to = InvDisountGroup, on_delete=models.CASCADE)
    option = models.ForeignKey(to = Type_of_options, on_delete=models.CASCADE)
    discount = models.DecimalField(decimal_places = 2, max_digits = 6, blank = False, null = False)

class UserInvDisount(models.Model):
    user = models.ForeignKey(to = User, on_delete=models.CASCADE)
    group = models.ForeignKey(to = InvDisountGroup, on_delete=models.CASCADE)
