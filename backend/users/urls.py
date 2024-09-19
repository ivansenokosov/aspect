from django.urls import path
from users.views import InvertorsViewset2
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
app_name = 'users'

urlpatterns = [
    path('invertors2', InvertorsViewset2.as_view()), # для частичной загрузки
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
