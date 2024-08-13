from rest_framework import serializers
from directories.models import *
from django.contrib.auth.models import User
from django.db.models.functions import Concat
from django.db.models import CharField, Value as V

class ManufactorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufactory
        fields = '__all__'

class Inv_input_voltageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_input_voltage
        fields = '__all__'
    
class Inv_output_voltageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_output_voltage
        fields = '__all__'

class Level_IPSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level_IP
        fields = '__all__'

class Inv_type_of_overloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_type_of_overload
        fields = '__all__'

class Inv_type_of_panelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_type_of_panels
        fields = '__all__'
class Inv_type_of_signalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_type_of_signals
        fields = '__all__'

class Ambient_temperaturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambient_temperatures
        fields = '__all__'

class Inv_accurancy_frenqSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_accurancy_frenq
        fields = '__all__'

class Type_of_controlSerializer(serializers.ModelSerializer):  # типы управления
    class Meta:
        model = Type_of_control
        fields = '__all__'

class Variants_of_controlSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variants_of_control
        fields = '__all__'

class Inv_breake_moduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_breake_module
        fields = '__all__'

class Inv_DC_drosselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_DC_drossel
        fields = '__all__'

class Inv_sizesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_sizes
        fields = '__all__'

class Inv_EMC_drosselSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inv_EMC_drossel
        fields = '__all__'

class Type_of_optionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type_of_options
        fields = '__all__'

class Type_of_itemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type_of_items
        fields = '__all__'

class Inv_seriesSerializer(serializers.ModelSerializer):
    # variants_of_control_str = serializers.SerializerMethodField() 

    # def get_variants_of_control_str(self, obj):
    #     variants = Inv_type_of_control.objects.all().filter(serie = obj.id).annotate(name = Concat('control', V(' ('), 'control', V(')'),  output_field=CharField()))
    #     return 'qqq'#variants

    class Meta:
        model = Inv_series
        fields = '__all__'

class Inv_type_of_controlSerializer(serializers.ModelSerializer):
    control_str = serializers.SerializerMethodField()     

    def get_control_str(self, obj):
        return f'{obj.control.name}'  

    class Meta:
        model = Inv_type_of_control
        fields = '__all__'

class Inv_spec_of_in_outSerializer(serializers.ModelSerializer):
    signal_str        = serializers.SerializerMethodField()       

    def get_signal_str(self, obj):
        return f'{obj.signal.name}'        

    class Meta:
        model = Inv_spec_of_in_out
        fields = '__all__'

class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'

class InvertorsSerializer(serializers.ModelSerializer):
    serie_str               = serializers.SerializerMethodField()
    input_voltage_str       = serializers.SerializerMethodField()
    size_str                = serializers.SerializerMethodField()
    type_of_dc_drossel_str  = serializers.SerializerMethodField()
    type_of_emc_drossel_str = serializers.SerializerMethodField()

    manufactory_str       = serializers.SerializerMethodField()
    output_voltage_str    = serializers.SerializerMethodField()
    min_power             = serializers.SerializerMethodField()
    max_power             = serializers.SerializerMethodField()
    type_of_control       = serializers.SerializerMethodField()
    type_of_control_str   = serializers.SerializerMethodField()
    type_of_panel         = serializers.SerializerMethodField()
    type_of_panel_str     = serializers.SerializerMethodField()
    overload_p_mode       = serializers.SerializerMethodField()
    overload_g_mode       = serializers.SerializerMethodField()
    type_of_accuracy_freq = serializers.SerializerMethodField()
    level_IP              = serializers.SerializerMethodField()
    level_IP_str          = serializers.SerializerMethodField()
    description           = serializers.SerializerMethodField()

    price                 = serializers.SerializerMethodField()         
    currency              = serializers.SerializerMethodField()         
    quantity              = serializers.SerializerMethodField()         
    waiting_period        = serializers.SerializerMethodField()         

    # type_of_options       = serializers.SerializerMethodField()         

    def get_price(self, obj):
        price = Prices.objects.filter(item = obj.item).order_by('-id')[0]
        return f'{price.price}'  

    def get_currency(self, obj):
        price = Prices.objects.filter(item = obj.item).order_by('date')[0]
        return f'{price.currency.name}'  

    def get_quantity(self, obj):
        return f'{round(obj.item.quantity)}'  

    def get_waiting_period(self, obj):
        return f'{obj.item.waiting_period}'  

    def get_description(self, obj):
        return '{}'.format(obj.serie.description)  

    def get_level_IP_str(self, obj):
        return '{}'.format(obj.serie.level_IP.name)  

    def get_level_IP(self, obj):
        return '{}'.format(obj.serie.level_IP.id)  

    def get_type_of_accuracy_freq(self, obj):
        return '{}'.format(obj.serie.type_of_accuracy_freq)  

    def get_overload_p_mode(self, obj):
        return f'{obj.serie.type_of_overload.p_mode}'  

    def get_overload_g_mode(self, obj):
        return f'{obj.serie.type_of_overload.g_mode}'  

    def get_type_of_overload(self, obj):
        return '{}'.format(obj.serie.type_of_overload.id)  

    def get_type_of_panel_str(self, obj):
        return '{}'.format(obj.serie.type_of_panel.name)  

    def get_type_of_panel(self, obj):
        return '{}'.format(obj.serie.type_of_panel.id)  

    def get_type_of_control_str(self, obj):
        return '{}'.format(obj.serie.type_of_control.name)  

    def get_type_of_control(self, obj):
        return '{}'.format(obj.serie.type_of_control.id)  

    def get_max_power(self, obj):
        return '{}'.format(obj.serie.max_power)  

    def get_min_power(self, obj):
        return '{}'.format(obj.serie.min_power)  

    def get_manufactory_str(self, obj):
        return '{}'.format(obj.serie.manufactory.name)  

    def get_output_voltage_str(self, obj):
        return '{}'.format(obj.serie.output_voltage.name)  

    def get_manufactory_str(self, obj):
        return '{}'.format(obj.serie.manufactory.name)  

    def get_serie_str(self, obj):
        return '{}'.format(obj.serie.name)  

    def get_input_voltage_str(self, obj):
        return '{}'.format(obj.input_voltage.name)  

    def get_size_str(self, obj):
        return '{}'.format(obj.size.name)  

    def get_type_of_dc_drossel_str(self, obj):
        return '{}'.format(obj.type_of_dc_drossel.name)  

    def get_type_of_emc_drossel_str(self, obj):
        return '{}'.format(obj.type_of_emc_drossel.name)  

    # def get_type_of_options(self, obj):
    #     type_of_options = Inv_options.objects.all().filter(series__icontains=obj.serie.id).values_list('option').distinct() #*****
    #     print(list(type_of_options))
    #     return f'{type_of_options}'

    class Meta:
        model = Invertors
        fields = '__all__'

class Inv_optionsSerializer(serializers.ModelSerializer):
    price                 = serializers.SerializerMethodField()         
    quantity              = serializers.SerializerMethodField()         
    waiting_period        = serializers.SerializerMethodField()         
    option_type           = serializers.SerializerMethodField()         

    def get_price(self, obj):
        price = Prices.objects.filter(item = obj.item).order_by('date')[0]
        return f'{price.price}'  

    def get_quantity(self, obj):
        return f'{round(obj.item.quantity)}'  

    def get_waiting_period(self, obj):
        return f'{obj.item.waiting_period}'  
    
    def get_option_type(self, obj):
        return f'{obj.option.name.strip()} '     

    class Meta:
        model = Inv_options
        fields = '__all__'

class InvSizesDict(serializers.ModelSerializer):
    name           = serializers.SerializerMethodField()

    def get_name(self, obj):
        return f'{obj.size} - {obj.name}'

    class Meta:
        model = Inv_sizes
        fields = ['id','name']


class InvSerieDict(serializers.ModelSerializer):
    class Meta:
        model = Inv_series
        fields = ['id','name']


class InvPowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invertors
        fields = ['p_heavy_g','p_pumps_p']

class InvertorDictSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invertors
        fields = ['id','name']


class InvOverlaodDictSerializer(serializers.ModelSerializer):
    name           = serializers.SerializerMethodField()

    def get_name(self, obj):
        return f'Режим P: {obj.p_mode}. Режим G:  {obj.g_mode}'
    
    class Meta:
        model = Inv_type_of_overload
        fields = ['id','name']


class UserDictSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name']

class WaitingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waiting_period
        fields = '__all__'

class PricesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prices
        fields = '__all__'