# Generated by Django 4.2.5 on 2023-10-03 07:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qrestauApp', '0002_mealitem_ordered_at_alter_meal_start_datetime'),
    ]

    operations = [
        migrations.RenameField(
            model_name='mealitem',
            old_name='delivered',
            new_name='is_delivered',
        ),
        migrations.RemoveField(
            model_name='meal',
            name='status',
        ),
        migrations.AddField(
            model_name='meal',
            name='is_closed',
            field=models.BooleanField(db_index=True, default=0),
        ),
    ]