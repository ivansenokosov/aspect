from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from users.serializers import UserSerializer
from django.contrib.auth.models import User

from fpdf import FPDF
# from fpdf.fonts import FontFace
# from fpdf.enums import TableCellFillMode
from django.http import HttpResponse

from userconfigs.models import UserInvConfigs
from directories.models import *
import json
from datetime import datetime as dt


def ifnull(var, val):
  if var is None:
    return val
  return var

class PDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.add_font("dejavu-sans", style="", fname="static/fonts/DejaVuSans.ttf")
        self.set_font('dejavu-sans', '', 8)
        self.set_text_color(128)
        self.cell(0, 10, f"Страница {self.page_no()}", align="C")

def CreatePDF(request):
    baseUrl = 'http://192.168.1.5:8000/'
    if request.method == 'GET':
        id = int(request.GET['id'])
        print(id)

        userconfig = UserInvConfigs.objects.get(id = id)
        invertor = Invertors.objects.get(id = userconfig.invertor.id)

        aval_controls = Inv_type_of_control.objects.all().filter(serie = invertor.serie.id)
        aval_control_str = ''
        for i in aval_controls:
            aval_control_str += i.control.name + ', '

        aval_type_of_options = Inv_options.objects.all().filter(series__icontains = str(invertor.serie.id)).values('option__name').distinct()

        aval_type_of_options_str = ''
        for i in aval_type_of_options:
            aval_type_of_options_str += i['option__name'] + ', '

        selected_options_json = json.loads(userconfig.options)

        price = int(invertor.price())
        option_price = 0
        for i in selected_options_json:
            option = Inv_options.objects.get(id = i)
            option_price += int(option.price())


    pdf = PDF()
    pdf.add_page()
    pdf.add_font("dejavu-sans", style="", fname="static/fonts/DejaVuSans.ttf")
    pdf.add_font("dejavu-sans", style="b", fname="static/fonts/DejaVuSans-Bold.ttf")
    pdf.add_font("dejavu-sans", style="i", fname="static/fonts/DejaVuSans-Oblique.ttf")
    pdf.add_font("dejavu-sans", style="bi", fname="static/fonts/DejaVuSans-BoldOblique.ttf")
    # Different type of the same font design.
    pdf.add_font("dejavu-sans-narrow", style="", fname="static/fonts/DejaVuSansCondensed.ttf")
    pdf.add_font("dejavu-sans-narrow", style="i", fname="static/fonts/DejaVuSansCondensed-Oblique.ttf")

# -------- Предварительное ценовое предложение
    pdf.image("static/aspect_logo.jpg", 10, 8, 45)
    pdf.add_font("dejavu-sans", style="", fname="static/fonts/DejaVuSans.ttf")
    pdf.set_font('dejavu-sans', '', 6)
    pdf.ln(8)
    pdf.write(5, '''ООО "АСПЕКТ". +7 (343) 204‐94‐50, info@ids‐drives.ru, ids‐drives.ru''')
    pdf.ln(13)
    pdf.set_font('dejavu-sans', 'B', 12)
    pdf.write(7, "Технико-коммерческое предложение № " + str(userconfig.user.id) + '/' + str(userconfig.id) + ' от ' + (userconfig.date).strftime('%d.%m.%Y'))
    pdf.ln(13)
    pdf.set_font('dejavu-sans', '', 9)

    docs_url = baseUrl + 'media/link_to_doc.png'
    photo_url = baseUrl + invertor.serie.photo.url

    greyscale = 200

    with pdf.table(cell_fill_color=greyscale, cell_fill_mode="ROWS", borders_layout='NONE') as table:
        row = table.row()
        row = table.row()

        row = table.row()
        row.cell(''' 









''')
        row.cell(img = photo_url)

        row = table.row()
        row.cell('Тип оборудования')
        row.cell('Преобразователь частоты')

        row = table.row()
        row.cell('Цена преобразователя (с НДС)')
        row.cell(str(price) + ' руб.')

        row = table.row()
        row.cell('Цена выбранных опций (с НДС)')
        row.cell(str(option_price) + ' руб.')

        row = table.row()
        row.cell('Наименование')
        row.cell(invertor.name)

        row = table.row()
        row.cell('Серия')
        row.cell(invertor.serie.name)

        row = table.row()
        row.cell('''Документация
                 
                 
                 
                 ''')
        row.cell(img = docs_url)


        row = table.row()
        row.cell('Мощность')
        row.cell('''Режим G: ''' + str(invertor.p_heavy_g) + ''' кВт
Режим P: ''' +  str(invertor.p_pumps_p) + ' кВт')

        row = table.row()
        row.cell('Ток')
        row.cell('''Режим G: ''' + str(invertor.current_g) + ''' А
Режим P: ''' +  str(invertor.current_p) + ' А')


        row = table.row()
        row.cell('Перегрузочная способность')
        row.cell('''Режиим G: ''' + ifnull(invertor.serie.type_of_overload.g_mode,'') + '''
Режим P: ''' + ifnull(invertor.serie.type_of_overload.p_mode,'') + '''
(не  чаще 1 раза в 10 мин)''')

        row = table.row()
        row.cell('Диапазон напряжений на входе')
        row.cell(invertor.input_voltage.name)

        row = table.row()
        row.cell('Диапазон напряжений на выходе')
        row.cell(invertor.serie.output_voltage.name)

        row = table.row()
        row.cell('Метод управления')
        row.cell(invertor.serie.type_of_control.name)

        row = table.row()
        row.cell('Способ управления')
        row.cell(aval_control_str)

        row = table.row()
        row.cell('Точность регулирования частоты')
        row.cell(invertor.serie.type_of_accuracy_freq.name)

        row = table.row()
        row.cell('Тип панели')
        row.cell(invertor.serie.type_of_panel.name)

        row = table.row()
        row.cell('EMC дроссель')
        row.cell(invertor.type_of_emc_drossel.name)

        row = table.row()
        row.cell('DC дроссель')
        row.cell(invertor.type_of_dc_drossel.name)

        row = table.row()
        row.cell('Тормозной модуль')
        row.cell(invertor.type_of_break_module.name)

        row = table.row()
        row.cell('Уровень защиты')
        row.cell(invertor.serie.level_IP.name)

        row = table.row()
        row.cell('Температура окр. среды')
        row.cell(invertor.serie.ambient_temperature.name)

        row = table.row()
        row.cell('Доступные опции')
        row.cell(aval_type_of_options_str)

        row = table.row()
        row.cell('Дополнительное описание')
        row.cell(invertor.serie.description)


        row = table.row()
        row.cell('Производитель')
        row.cell(invertor.serie.manufactory.name + '/Аспект')

# --------Входы/Выходы 
    pdf.add_page()
    pdf.cell(80)
    pdf.cell(30, 30, "Входы/выходы управления", border=0, align="C")
    pdf.ln(50)


    input_output = Inv_spec_of_in_out.objects.filter(serie = invertor.serie.id)
    with pdf.table(cell_fill_color=greyscale, cell_fill_mode="ROWS", borders_layout='NONE') as table:
        row = table.row()
        row.cell('Сигнал')
        row.cell('Количество')
        for signal in input_output:
            row = table.row()
            row.cell(signal.signal.name)
            row.cell(str(signal.quantity))

# ------ Выбранные опции
    pdf.add_page()
    pdf.cell(80)
    pdf.cell(30, 30, "Выбранные опции", border=0, align="C")
    pdf.ln(30)

    with pdf.table(cell_fill_color=greyscale, cell_fill_mode="ROWS", borders_layout='NONE') as table:
        row = table.row()
        row.cell('Наименование')
        row.cell('Описание')
        row.cell('Доп.описание')
        row.cell('Тип')
        row.cell('Количество')
        row.cell('Цена')
        for i in selected_options_json:
            option = Inv_options.objects.get(id = i)
            row = table.row()
            row.cell(option.name)
            row.cell(option.full_title)
            row.cell(option.short_title)
            row.cell(option.option.name)
            row.cell(str(option.item.quantity))
            row.cell(str(option.price()))


# ------ Схема
    pdf.add_page()
    pdf.ln(15)
    pdf.write(10,'Схема')
    schema_url = baseUrl + invertor.serie.schema.url
    pdf.image(schema_url, 10, 50, 150)


    response = HttpResponse(bytes(pdf.output(dest='S')), content_type='application/pdf')
    response['Content-Disposition'] = "attachment; filename=aspect.pdf"
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
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
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