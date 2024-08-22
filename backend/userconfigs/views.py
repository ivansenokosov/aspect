from rest_framework import viewsets, permissions
from userconfigs.serializers import *
from userconfigs.models import *
from rest_framework.response import Response


#--------------------------- UserConfigs --------------------------------------
class UserInvConfigsViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = UserInvConfigs.objects.all()
    serializer_class = UserInvConfigsSerializer
    
    def list(self, request):
        user_id = request.GET.get('user_id')
        if user_id:
            queryset = UserInvConfigs.objects.all().filter(user = user_id)
        else:
            queryset = UserInvConfigs.objects.all()
        serializer = self.serializer_class(queryset, many = True)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status = 400)

    def retrieve(self, request, pk=None):
        object = self.queryset.get(pk=pk)
        serializer = self.serializer_class(object)
        return Response(serializer.data)

    def update(self, request, pk=None):
        object = self.queryset.get(pk=pk)
        serializer = self.serializer_class(object, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status = 400)        

    def destroy(self, request, pk=None):
        company = self.queryset.get(pk=pk)
        company.delete()
        return Response(status = 204) 
    

#--------------------------- Сколько конфигураций не открыто     --------------------------------------
class InvConfigUnreadViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = UserInvConfigs.objects.all().filter(staff_opened = False)
    serializer_class = CountUnreadSerializer  