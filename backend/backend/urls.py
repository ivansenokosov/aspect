from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static

from backend import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',                 include('directories.urls',            namespace='directories')),
    path('userconfigs/',     include('userconfigs.urls',            namespace='userconfigs')),
    path('login/',           include('users.urls',                  namespace='login')),

    
    # path("__debug__/",       include("debug_toolbar.urls")),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)