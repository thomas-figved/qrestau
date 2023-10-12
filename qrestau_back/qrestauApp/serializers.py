from rest_framework import serializers
from .models import Item, Category, Table, Meal, MealItem
from django.contrib.auth.models import User, Group

class GroupSerializer (serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id','name']

class UserSerializer (serializers.ModelSerializer):
    groups = GroupSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ['id','username', 'groups']

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
    meal = serializers.SerializerMethodField()

    class Meta:
        model = Table
        fields = ['id','title', 'meal']

    def get_meal(self, obj):
        meal_data = None
        started_meal = Meal.objects.filter(table_id=obj.id, is_closed=False).first()
        if started_meal is not None:
            meal_data = {
                'id': started_meal.id,
                'start_datetime': started_meal.start_datetime.strftime('%Y-%m-%d %H:%M:%S'),
                'password': started_meal.password,
            }

        return meal_data


class MealItemSerializer(serializers.ModelSerializer):
    item_id = serializers.IntegerField(write_only=True)
    item = ItemSerializer(read_only=True)

    class Meta:
        model = MealItem
        fields = ['id','qty','price','ordered_at','is_delivered', 'item_id', 'item']

class MealSerializer(serializers.ModelSerializer):
    table_id = serializers.IntegerField(write_only=True)
    table = TableSerializer(read_only=True)

    meal_items = MealItemSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = ['id','table_id','table','start_datetime','end_datetime','is_closed', 'meal_items', 'password']