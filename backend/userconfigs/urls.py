from userconfigs import views
from rest_framework.routers import DefaultRouter

app_name = 'userconfigs'

router = DefaultRouter()
router.register('UserInvConfg', views.UserInvConfigsViewset, 'UserInvConfg')
router.register('CountUnread', views.InvConfigUnreadViewset, 'CountUnread')



urlpatterns = router.urls