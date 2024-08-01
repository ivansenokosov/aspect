from fpdf import FPDF
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from userconfigs.serializers import *
from userconfigs.models import *
from rest_framework.response import Response


def CreatePDF(request):
    pdf = FPDF()
    pdf.add_font('DejaVu', '', 'static/fonts/DejaVuSansCondensed.ttf', uni=True)
    pdf.set_font('DejaVu', '', 8)
    
    pdf.add_page()
    pdf.write(4, 'txt')
    pdf.ln(5)

    pdf.output("unicode.pdf", 'F')

    response = HttpResponse(bytes(pdf.output()), content_type='application/pdf')
    response['Content-Disposition'] = "attachment; filename=myfilename.pdf"
    return response    


#--------------------------- UserConfigs --------------------------------------
class UserInvConfigsViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = UserInvConfigs.objects.all()
    serializer_class = UserInvConfigsSerializer
    
    def list(self, request):
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