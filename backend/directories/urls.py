from directories import views
from rest_framework.routers import DefaultRouter

app_name = 'directories'

router = DefaultRouter()
router.register('Manufactoty', views.ManufactoryViewset, 'Manufactory')
router.register('Inv_input_voltage', views.Inv_input_voltageViewset, 'Inv_input_voltage')
router.register('Inv_output_voltage', views.Inv_output_voltageViewset, 'Inv_output_voltage')
router.register('Level_IP', views.Level_IPViewset, 'Level_IP')
router.register('Inv_type_of_overload', views.Inv_type_of_overloadViewset, 'Inv_type_of_overload')
router.register('Inv_type_of_panels', views.Inv_type_of_panelsViewset, 'Inv_type_of_panels')
router.register('Inv_type_of_signals', views.Inv_type_of_signalsViewset, 'Inv_type_of_signals')
router.register('Ambient_temperatures', views.Ambient_temperaturesViewset, 'Ambient_temperatures')
router.register('Inv_accurancy_frenq', views.Inv_accurancy_frenqViewset, 'Inv_accurancy_frenq')
router.register('Type_of_control', views.Type_of_controlViewset, 'Type_of_control')
router.register('Variants_of_control', views.Variants_of_controlViewset, 'Variants_of_control')
router.register('Inv_breake_module', views.Inv_breake_moduleViewset, 'Inv_breake_module')
router.register('Inv_DC_drossel', views.Inv_DC_drosselViewset, 'Inv_DC_drossel')
router.register('Inv_sizes', views.Inv_sizesViewset, 'Inv_sizes')
router.register('Inv_EMC_drossel', views.Inv_EMC_drosselViewset, 'Inv_EMC_drossel')
router.register('Type_of_options', views.Type_of_optionsViewset, 'Type_of_options')
router.register('Type_of_items', views.Type_of_itemsViewset, 'Type_of_items')
router.register('Inv_series', views.Inv_seriesViewset, 'Inv_series')
router.register('Inv_type_of_control', views.Inv_type_of_controlViewset, 'Inv_type_of_control')
router.register('Inv_spec_of_in_out', views.Inv_spec_of_in_outViewset, 'Inv_spec_of_in_out')
router.register('Items', views.ItemsViewset, 'Items')
router.register('Invertors', views.InvertorsViewset, 'Invertors')
router.register('Inv_options', views.Inv_optionsViewset, 'Inv_options')
router.register('Inv_powers', views.InvPowerViewset, 'Inv_powers')
router.register('Inv_sizes_dict', views.InvSizesDictViewset, 'Inv_sizes_dict')  # для комбо
router.register('Inv_series_dict', views.InvSeriesDictViewset, 'Inv_series_dict')  # для комбо
router.register('Inv_overload_dict', views.InvOverloadDictViewset, 'Inv_overload_dict')  # для комбо
router.register('Invertor_dict', views.InvertorDictViewset, 'Invertor_dict')  # для комбо
router.register('Users', views.UserDictViewset, 'Users')  # для комбо


urlpatterns = router.urls