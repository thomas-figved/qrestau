from django.shortcuts import render
from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from .models import Item
from .serializers import ItemSerializer

class ItemsView(viewsets.ModelViewSet):
    model = Item
    queryset = Item.objects.all()
    serializer_class = ItemSerializer