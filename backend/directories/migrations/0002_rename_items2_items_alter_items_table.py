# Generated by Django 5.0.7 on 2024-07-30 06:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('directories', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Items2',
            new_name='Items',
        ),
        migrations.AlterModelTable(
            name='items',
            table='d_items',
        ),
    ]
