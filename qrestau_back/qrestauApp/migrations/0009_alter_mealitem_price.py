# Generated by Django 4.2.5 on 2023-10-04 06:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qrestauApp', '0008_alter_mealitem_meal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mealitem',
            name='price',
            field=models.DecimalField(decimal_places=2, max_digits=6, null=True),
        ),
    ]
