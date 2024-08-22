from django.db import models
from django.contrib.auth.models import User

# производитель
# загружен
class Manufactory(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_manufactory'
        verbose_name = "Производитель"
        verbose_name_plural = "Производители"

    def __str__(self):
        return f'{self.name}'

# Входное напряжение
# загружен
class Inv_input_voltage(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_input_voltage'
        verbose_name = "Выходное напряжение ПЧ"
        verbose_name_plural = "Выходные напряжения ПЧ"

    def __str__(self):
        return f'{self.name}'


# Выходное напряжение
# загружен
class Inv_output_voltage(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_output_voltage'
        verbose_name = "Выходное напряжение ПЧ"
        verbose_name_plural = "Выходные напряжения ПЧ"

    def __str__(self):
        return f'{self.name}'


# Уровень защиты IP
# загружен
class Level_IP(models.Model):
    name = models.CharField(max_length=50, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_level_ip'
        verbose_name = "Уровень защиты IP"
        verbose_name_plural = "Уровени защиты IP"

    def __str__(self):
        return f'{self.name}'


# Типы перегруки
# загружен
class Inv_type_of_overload(models.Model):
    g_mode = models.CharField(max_length=200, blank=False, null = False, verbose_name='G_режим')
    p_mode = models.CharField(max_length=200, blank=False, null = True, verbose_name='P_режим')

    class Meta:
        db_table = 's_inv_type_of_overload'
        verbose_name = "Тип перегруки"
        verbose_name_plural = "Типы перегруки"

    def __str__(self):
        return f'Gрежим: {self.g_mode}, Pрежим: {self.p_mode}'
    

# Типы панели
# загружен
class Inv_type_of_panels(models.Model):
    name = models.CharField(max_length=50, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_type_of_panel'
        verbose_name = "Тип панели"
        verbose_name_plural = "Типы панели"

    def __str__(self):
        return f'{self.name}'


# Типы сигналов
# загружен
class Inv_type_of_signals(models.Model):
    name = models.CharField(max_length=50, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_type_of_signals'
        verbose_name = "Тип сигнала"
        verbose_name_plural = "Типы сигнала"

    def __str__(self):
        return f'{self.name}'
    

# Допустимая температура окружающей среды
# загружен
class Ambient_temperatures(models.Model):
    name = models.CharField(max_length=50, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_ambient_temperatures'
        verbose_name = "Допустимая температура окружающей среды"
        verbose_name_plural = "Допустимые температуры окружающей среды"

    def __str__(self):
        return f'{self.name}'
        
    
# Точность регулирования частоты
# загружен
class Inv_accurancy_frenq(models.Model):
    name = models.CharField(max_length=50, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_accurancy_frenq'
        verbose_name = "Точность регулирования частоты"
        verbose_name_plural = "Точность регулирования частоты"

    def __str__(self):
        return f'{self.name}'


# Типы управления
# загружен
class Type_of_control(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_type_of_control'
        verbose_name = "Тип управления"
        verbose_name_plural = "Типы управления"

    def __str__(self):
        return f'{self.name}'
    

# Варианты управления
# загружен
class Variants_of_control(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_variant_of_control'
        verbose_name = "Вариант управления"
        verbose_name_plural = "Варианты управления"

    def __str__(self):
        return f'{self.name}'



# Типы тормозного модуля
# загружен
class Inv_breake_module(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_breake_module'
        verbose_name = "Тип тормозного модуля"
        verbose_name_plural = "Типы тормозного модуля"

    def __str__(self):
        return f'{self.name}'    
    

# Тип DC дросселя    
# загружен
class Inv_DC_drossel(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_DC_drossel'
        verbose_name = "Тип DC дросселя"
        verbose_name_plural = "Типы DC дросселя"

    def __str__(self):
        return f'{self.name}' 
    

# Размеры инверторов
# загружен
class Inv_sizes(models.Model):
    size = models.IntegerField(blank=False, null = False, verbose_name='Размер')
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_size_of_invertors'
        verbose_name = "Размер инвертоа"
        verbose_name_plural = "Размеры инверторов"

    def __str__(self):
        return f'{self.name}' 


# Тип EMC дросселя
# загружен
class Inv_EMC_drossel(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_inv_EMC_drossel'
        verbose_name = "Тип EMC дросселя"
        verbose_name_plural = "Типы EMC дросселя"

    def __str__(self):
        return f'{self.name}' 


# Типы опций ПЧ
# загружен
class Type_of_options(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_type_of_options'
        verbose_name = "Тип опции"
        verbose_name_plural = "Типы опций"

    def __str__(self):
        return f'{self.name}' 


# Типы элементов    
# загружен
class Type_of_items(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_type_of_items'
        verbose_name = "Тип элемента"
        verbose_name_plural = "Типы элементов"

    def __str__(self):
        return f'{self.name}' 


# Серии ПЧ
# загружен
class Inv_series(models.Model):
    manufactory           = models.ForeignKey(to = Manufactory, on_delete=models.CASCADE, verbose_name='Производитель')
    output_voltage        = models.ForeignKey(to = Inv_output_voltage, on_delete=models.CASCADE, verbose_name='Выходное напряжение')
    min_power             = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null = False, verbose_name='Минимальная мощность') 
    max_power             = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null = False, verbose_name='Максимальная мощность')
    type_of_control       = models.ForeignKey(to = Type_of_control, on_delete=models.CASCADE, verbose_name='Тип управления')
    type_of_panel         = models.ForeignKey(to = Inv_type_of_panels, on_delete=models.CASCADE, verbose_name='Тип панели')
    type_of_overload      = models.ForeignKey(to = Inv_type_of_overload, on_delete=models.CASCADE, verbose_name='Тип перегрузки')
    type_of_accuracy_freq = models.ForeignKey(to = Inv_accurancy_frenq, on_delete=models.CASCADE, verbose_name='Точность регулирования')
    ambient_temperature   = models.ForeignKey(to = Ambient_temperatures, on_delete=models.CASCADE, verbose_name='Допустимая температура окружающей среды')
    level_IP              = models.ForeignKey(to = Level_IP, on_delete=models.CASCADE, verbose_name='Уровень защиты')
    name                  = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')
    description           = models.CharField(max_length=500, blank=False, null = False, verbose_name='Дополнительное описание')
    photo                 = models.ImageField(upload_to="inv_series", blank=True, null=True, verbose_name="Изображение")
    schema                = models.ImageField(upload_to="inv_series_schema", blank=True, null=True, verbose_name="Схема")

    class Meta:
        db_table = 's_inv_series'
        verbose_name = "Серия ПЧ"
        verbose_name_plural = "Серии ПЧ"

    def __str__(self):
        return f'{self.name}'
    

# Способы управления для серии
# загружен
class Inv_type_of_control(models.Model):
    control     = models.ForeignKey(to=Variants_of_control, on_delete=models.CASCADE)   
    serie       = models.ForeignKey(to=Inv_series, on_delete=models.CASCADE)

    class Meta:
        db_table = 's_type_of_serie_controls'
        verbose_name = "Способ управления для серии ПЧ"
        verbose_name_plural = "Способы управления для серии ПЧ"

    def __str__(self):
        return f'{self.serie.name} - {self.control}'
    

# Таблица входов\выходов
# загружен
class Inv_spec_of_in_out(models.Model):
    serie       = models.ForeignKey(to=Inv_series, on_delete = models.CASCADE)
    signal      = models.ForeignKey(to=Inv_type_of_signals, on_delete = models.CASCADE)
    info        = models.CharField(max_length=50, blank=False, null = False, verbose_name='Описание входа')
    quantity    = models.IntegerField(blank=False, null = False, verbose_name='Количество')

    class Meta:
        db_table = 's_inv_spec_of_in_out'
        verbose_name = "Сигналы входов/выходов"
        verbose_name_plural = "Сигналы входов/выходов"

    def __str__(self):
        return f'{self.serie.name} - {self.signal.name}'


# Сроки ожидания
class Waiting_period(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_waiting_time'
        verbose_name = "Срок ожидания"
        verbose_name_plural = "Сроки ожидания"

    def __str__(self):
        return f'{self.name}' 

# Элемент    
# загружен



class Items(models.Model):
    type = models.ForeignKey(to = Type_of_items, on_delete=models.CASCADE)
    name = models.CharField(max_length=500, blank = True, null = True, verbose_name='Наименование')
    quantity = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    waiting_period = models.ForeignKey(to = Waiting_period, on_delete=models.CASCADE)

    class Meta:
        db_table = 'd_items'
        verbose_name = "Элемент"
        verbose_name_plural = "Элементы"

    def __str__(self):
        return f'{self.name}' 

# Преобразователи частоты
# загружен
class Invertors(models.Model):
    item                 = models.ForeignKey(to = Items, on_delete=models.CASCADE, verbose_name='Элемент')
    serie                = models.ForeignKey(to = Inv_series, on_delete=models.CASCADE, verbose_name='Серия')
    input_voltage        = models.ForeignKey(to = Inv_input_voltage, on_delete=models.CASCADE, verbose_name='Входное напраяжение')
    size                 = models.ForeignKey(to = Inv_sizes, on_delete=models.CASCADE, verbose_name='Размер')
    type_of_break_module = models.ForeignKey(to = Inv_breake_module, on_delete=models.CASCADE, verbose_name='Тип тормозного модуля')
    type_of_dc_drossel   = models.ForeignKey(to = Inv_DC_drossel, on_delete=models.CASCADE, verbose_name='Тип DC дросселя')
    type_of_emc_drossel  = models.ForeignKey(to = Inv_EMC_drossel, on_delete=models.CASCADE, verbose_name='Тип EMC дросселя')
    name                 = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')
    p_heavy_g            = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null = False, verbose_name='')
    p_pumps_p            = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null = False, verbose_name='')
    current_g            = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null = False, verbose_name='')
    current_p            = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=False, null = False, verbose_name='')

    class Meta:
        db_table = 'd_invertors'
        verbose_name = "Преобразователь частоты"
        verbose_name_plural = "Преобразователи частоты"

    def price(self):
        price = Prices.objects.filter(item = self.item).first()
        return price.price

    def __str__(self):
        return f'{self.name}' 


# Опции ПЧ
class Inv_options(models.Model):
    item            = models.ForeignKey(to = Items, on_delete=models.CASCADE, verbose_name='Элемент')
    name            = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')
    short_title     = models.CharField(max_length=500, blank=True, null = True, verbose_name='Наименование краткое')
    full_title      = models.CharField(max_length=500, blank=True, null = True, verbose_name='Наименование полное')
    series          = models.CharField(max_length=500, blank=True, null = True, verbose_name='Серии')
    option          = models.ForeignKey(to = Type_of_options, on_delete=models.CASCADE, verbose_name='Типы опции')

    class Meta:
        db_table = 'd_inv_options'
        verbose_name = "Опции ПЧ"
        verbose_name_plural = "Опций ПЧ"

    def __str__(self):
        return f'{self.name}'
    
    def price(self):
        p = Prices.objects.filter(item=self.item).first()
        return p.price


    
# Валюты
class Currency(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')

    class Meta:
        db_table = 's_currency'
        verbose_name = "Валюта"
        verbose_name_plural = "Валюты"

    def __str__(self):
        return f'{self.name}' 
    
# Price
class Prices(models.Model):
    item = models.ForeignKey(to  = Items, on_delete=models.CASCADE)
    currency = models.ForeignKey(to = Currency, on_delete=models.CASCADE)
    price = models.DecimalField(default=0, max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add = True, blank = True, null = True)

    class Meta:
        db_table = 'd_prices'
        verbose_name = "Цена"
        verbose_name_plural = "Цены"

    def __str__(self):
        return f'{self.item.id}' 
    

class Companies(models.Model):
    name = models.CharField(max_length=500, blank=False, null = False, verbose_name='Наименование')
    inn = models.CharField(max_length=20, blank=True, null = True, verbose_name='ИНН')
    address = models.CharField(max_length=500, blank=True, null = True, verbose_name='Адрес')
    agreement = models.CharField(max_length=100, blank=True, null = True, verbose_name='Договор')
    info = models.CharField(max_length=500, blank=True, null = True, verbose_name='Примечание')
    phone = models.CharField(max_length=20, blank=True, null = True, verbose_name='Телефон')
    email = models.EmailField(null = True, blank = True)
    logo = models.ImageField(upload_to="logos", blank=True, null=True, verbose_name="Логотип")

    class Meta:
        db_table = 'd_companies'
        verbose_name = "Организация"
        verbose_name_plural = "Организации"

    def __str__(self):
        return f'{self.name}' 
    
class CompanyUsers(models.Model):
    company = models.ForeignKey(to = Companies, on_delete=models.CASCADE)
    user = models.ForeignKey(to = User, on_delete=models.CASCADE)

    class Meta:
        db_table = 'd_companyusers'
        verbose_name = "Пользователи организации"
        verbose_name_plural = "Пользователи организации"

    def __str__(self):
        return f'{self.user.id}' 