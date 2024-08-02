from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from users.serializers import UserSerializer
from django.contrib.auth.models import User
from fpdf import FPDF
from django.http import HttpResponse


# import datetime
# import jwt

class PDF(FPDF):
    def header(self):
        # Logo
        # self.image('media/inv_series/FCI.jpg', 10, 8, 33)
        # Arial bold 15
        self.set_font('Arial', 'B', 15)
        # Move to the right
        self.cell(80)
        # Title
        self.cell(30, 10, 'Title', 1, 0, 'C')
        # Line break
        self.ln(20)

    # Page footer
    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Arial italic 8
        self.set_font('Arial', 'I', 8)
        # Page number
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')



def CreatePDF(request):
    pdf = FPDF()
    pdf.add_page()    
    pdf.add_font('DejaVu', '', 'static/fonts/DejaVuSansCondensed.ttf', uni=True)
    pdf.set_font('DejaVu', '', 8)
    
    text = u"""
    English: Hello World
    Greek: Γειά σου κόσμος
    Polish: Witaj świecie
    Portuguese: Olá mundo
    Russian: Здравствуй, Мир
    Vietnamese: Xin chào thế giới
    Arabic: مرحبا العالم
    Hebrew: שלום עולם
    """

    pdf.image(name = 'http://localhost:8000/media/inv_series/FCI.png', x=10, y=8, w=33)

    for txt in text.split('\n'):
        pdf.write(8, txt)
        pdf.ln(8)


    response = HttpResponse(bytes(pdf.output(dest='S').encode('latin-1')), content_type='application/pdf')
    response['Content-Disposition'] = "attachment; filename=myfilename.pdf"
    return response



# class RegisterView(APIView):
#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        username = request.data['login']
        password = request.data['password']

        user = User.objects.filter(username=username).first()
        response = Response()


        if user is None:
            response.data = {
                'status': 2,
                'info': 'Пользователь не найден',
            }
            return response
#            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            response.data = {
                'status': 3,
                'info': 'Пароль неверный',
            }
            return response

#            print('пароль неверный')
#           raise AuthenticationFailed('Incorrect password!')
        
#        response.set_cookie(key='user', value='1', httponly=True)
        response.data = {
            'status': 1,
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff
        }
        return response

        # payload = {
        #     'id': user.id,
        #     'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        #     'iat': datetime.datetime.utcnow()
        # }

        # token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        # response = Response()

        # response.set_cookie(key='jwt', value=token, httponly=True)
        # response.data = {
        #     'jwt': token
        # }
        # return response


# class UserView(APIView):

#     def get(self, request):
#         token = request.COOKIES.get('jwt')

#         if not token:
#             raise AuthenticationFailed('Unauthenticated!')

#         try:
#             payload = jwt.decode(token, 'secret', algorithm=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise AuthenticationFailed('Unauthenticated!')

#         user = User.objects.filter(id=payload['id']).first()
#         serializer = UserSerializer(user)
#         return Response(serializer.data)


# class LogoutView(APIView):
#     def post(self, request):
#         response = Response()
#         response.delete_cookie('jwt')
#         response.data = {
#             'message': 'success'
#         }
#         return response