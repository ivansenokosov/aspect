from rest_framework import viewsets, permissions
from discounts.serializers import *
from discounts.models import *
from rest_framework.response import Response
from django.contrib.auth.models import User

#--------------------------- InvDisountGroup --------------------------------------
class InvDisountGroupViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = InvDisountGroup.objects.all()
    serializer_class = InvDisountGroupSerializer
    
    def list(self, request):
        queryset = InvDisountGroup.objects.all()
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
    
#--------------------------- InvSerieDisount --------------------------------------
class InvSerieDisountViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = InvSerieDisount.objects.all()
    serializer_class = InvSerieDisountSerializer
    
    def list(self, request):
        group = request.GET.get('group')
        if group:
            queryset = InvSerieDisount.objects.all().filter(group = group)
        else:
            queryset = InvSerieDisount.objects.all()
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
    
#--------------------------- InvOptionDisount --------------------------------------
class InvOptionDisountViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = InvOptionDisount.objects.all()
    serializer_class = InvOptionDisountSerializer
    
    def list(self, request):
        group = request.GET.get('group')
        if group:
            queryset = InvOptionDisount.objects.all().filter(group = group)
        else:
            queryset = InvOptionDisount.objects.all()
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
    
#--------------------------- UserInvDisount --------------------------------------
class UserInvDisountViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = UserInvDisount.objects.all()
    serializer_class = UserInvDisountSerializer
    
    def list(self, request):
        user = request.GET.get('user')
        if user:
            queryset = UserInvDisount.objects.all().filter(user = user)
        else:
            queryset = UserInvDisount.objects.all()
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