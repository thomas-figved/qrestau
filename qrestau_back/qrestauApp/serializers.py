from rest_framework import serializers
from .models import Item, Category
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