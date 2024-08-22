from logs import views
from rest_framework.routers import DefaultRouter

app_name = 'logs'

router = DefaultRouter()
router.register('Logs', views.LogsViewset, 'Logs')
router.register('Actions', views.ActionsViewset, 'Actions')

urlpatterns = router.urls