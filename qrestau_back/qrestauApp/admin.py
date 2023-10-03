from django.contrib import admin
from .models import Item, Category, Table, Meal, MealItem

# Register your models here.
admin.site.register(Item)
admin.site.register(Category)
admin.site.register(Table)
admin.site.register(Meal)
admin.site.register(MealItem)
