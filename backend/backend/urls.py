from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings


from backend import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',                 include('directories.urls',            namespace='directories')),
    path('userconfigs/',     include('userconfigs.urls',            namespace='userconfigs')),
    path('users/',           include('users.urls',                  namespace='users')),

    
    # path("__debug__/",       include("debug_toolbar.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



