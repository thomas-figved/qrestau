from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    slug = models.SlugField()
    title = models.CharField(max_length = 255, db_index=True)

    def __str__(self):
        return self.title

class Item(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return self.title

class Table(models.Model):
    slug = models.SlugField()
    title = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.title

class Meal(models.Model):
    table = models.ForeignKey(Table, on_delete=models.PROTECT)
    start_datetime = models.DateTimeField(auto_now_add=True)
    end_datetime = models.DateTimeField(null=True)
    is_closed = models.BooleanField(default=0, db_index=True)
    password = models.CharField(max_length=255, db_index=True)
    anonymous_user =  models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return f'{self.id}: {self.table} : {str(self.start_datetime) } : {str(self.is_closed) }'

class MealItem(models.Model):
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2, null=True)
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    meal = models.ForeignKey(Meal, on_delete=models.PROTECT, related_name='meal_items')
    ordered_at = models.DateTimeField(auto_now_add=True)
    is_delivered = models.BooleanField(default=0)

    def __str__(self):
        return f'{self.id}: {self.item} : {str(self.meal) } : {str(self.qty) }'