from discounts import views
from rest_framework.routers import DefaultRouter

app_name = 'discounts'

router = DefaultRouter()
router.register('InvDisountGroup', views.InvDisountGroupViewset, 'InvDisountGroup')
router.register('InvSerieDisount', views.InvSerieDisountViewset, 'InvSerieDisount')
router.register('InvOptionDisount', views.InvOptionDisountViewset, 'InvOptionDisount')
router.register('UserInvDisount', views.UserInvDisountViewset, 'UserInvDisount')

urlpatterns = router.urls