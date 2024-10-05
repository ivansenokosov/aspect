from directories.models import *


from rest_framework.pagination import PageNumberPagination
from rest_framework import  generics
from directories.serializers import InvertorsSerializer
from directories.models import Invertors

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 20

class InvertorsViewset2(generics.ListAPIView):
    queryset = Invertors.objects.all()
    serializer_class = InvertorsSerializer
    pagination_class = StandardResultsSetPagination