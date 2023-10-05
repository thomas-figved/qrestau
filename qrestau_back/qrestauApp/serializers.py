from rest_framework import serializers
from .models import Item, Category, Table, Meal, MealItem
from django.contrib.auth.models import User, Group

class CategorySerializer (serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','title']

class ItemSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(write_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Item
        fields = ['id','title','price','category','category_id']

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id','title']


class MealItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealItem
        fields = ['id','qty','price','ordered_at','is_delivered']

class MealSerializer(serializers.ModelSerializer):
    table_id = serializers.IntegerField(write_only=True)
    table = TableSerializer(read_only=True)

    meal_items = MealItemSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = ['id','table_id','table','start_datetime','end_datetime','is_closed', 'meal_items', 'password']