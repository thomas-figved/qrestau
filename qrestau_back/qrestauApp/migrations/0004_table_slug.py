# Generated by Django 4.2.5 on 2023-10-03 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qrestauApp', '0003_rename_delivered_mealitem_is_delivered_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='slug',
            field=models.SlugField(default=''),
            preserve_default=False,
        ),
    ]
