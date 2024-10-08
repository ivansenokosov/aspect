# Generated by Django 5.0.7 on 2024-08-21 10:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('directories', '0003_inv_series_schema'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Companies',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=500, verbose_name='Наименование')),
                ('inn', models.CharField(blank=True, max_length=20, null=True, verbose_name='ИНН')),
                ('address', models.CharField(blank=True, max_length=500, null=True, verbose_name='Адрес')),
                ('agreement', models.CharField(blank=True, max_length=100, null=True, verbose_name='Договор')),
                ('info', models.CharField(blank=True, max_length=500, null=True, verbose_name='Примечание')),
                ('phone', models.CharField(blank=True, max_length=12, null=True, verbose_name='Телефон')),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('logo', models.ImageField(blank=True, null=True, upload_to='logos', verbose_name='Логотип')),
            ],
            options={
                'verbose_name': 'Организация',
                'verbose_name_plural': 'Организации',
                'db_table': 'd_companies',
            },
        ),
        migrations.CreateModel(
            name='CompanyUsers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='directories.companies')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Пользователи организации',
                'verbose_name_plural': 'Пользователи организации',
                'db_table': 'd_companyusers',
            },
        ),
    ]
