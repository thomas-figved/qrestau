from django.db import models

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
    title = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.title

class Meal(models.Model):
    table = models.ForeignKey(Table, on_delete=models.PROTECT)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    status = models.BooleanField(default=0)

    def __str__(self):
        return self.title

class MealItem(models.Model):
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    meal = models.ForeignKey(Category, on_delete=models.PROTECT)
    delivered = models.BooleanField(default=0)

    def __str__(self):
        return self.title