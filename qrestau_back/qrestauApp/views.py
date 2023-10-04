from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from rest_framework import generics, viewsets, status
from rest_framework.response import Response

from .models import Item, Meal, Table, MealItem
from .serializers import ItemSerializer, MealSerializer, MealItemSerializer

class ItemsView(viewsets.ModelViewSet):
    model = Item
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class ItemsDetailsView(viewsets.ModelViewSet):
    model = Item
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class MealView(viewsets.ModelViewSet):
    model = Meal
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

    def create(self, request):
        table_id = request.data.get('table_id')
        table = get_object_or_404(Table, id=table_id) #throw 404 if resource doesn't exist

        password = request.data.get('password')

        #check if there is already an open meal on this table
        already_opened_meal = Meal.objects.filter(table=table_id, is_closed=False)

        if(len(already_opened_meal) > 0):
            return Response({"message": "This table already has an open meal. Please close it first."}, status.HTTP_500_INTERNAL_SERVER_ERROR)

        if password == "":
            return Response({"message": "You have to set a password to open the meal"}, status.HTTP_500_INTERNAL_SERVER_ERROR)

        new_meal = Meal.objects.create(
            table= table,
            password= password,
        )

        new_meal.save()

        return Response({"message": "Meal started successfully"}, status.HTTP_201_CREATED)


class MealDetailsView(viewsets.ModelViewSet):
    model = Meal
    queryset = Meal.objects.all()
    serializer_class = MealSerializer

    def close(self, request, pk):
        to_close_meal = Meal.objects.get(pk=pk)

        to_close_meal.is_closed=True
        to_close_meal.end_datetime=now()

        to_close_meal.save()

        return Response({"message": "Meal successfully closed"}, status.HTTP_200_OK)

class MealItemView(viewsets.ModelViewSet):
    model = MealItem
    queryset = MealItem.objects.all()
    serializer_class = MealItemSerializer

    def get_queryset(self):
        queryset = super(MealItemView, self).get_queryset()

        meal_id = self.kwargs.get('meal_id', None)
        if meal_id is not None:
            queryset = queryset.filter(meal_id=meal_id)
        return queryset

    def create(self, request, meal_id):
        meal = get_object_or_404(Meal, id=meal_id) #throw 404 if resource doesn't exist

        item_id = request.data.get('item_id')
        item = get_object_or_404(Item, id=item_id) #throw 404 if resource doesn't exist

        new_meal_item = MealItem.objects.create(
            meal = meal,
            item = item,
            qty = request.data.get('qty'),
            price = item.price,
            ordered_at = now(),
            is_delivered = False,
        )

        new_meal_item.save()

        return Response({"message": "Item has been added to the meal"}, status.HTTP_201_CREATED)

class MealItemDetailsView(viewsets.ModelViewSet):
    model = MealItem
    queryset = MealItem.objects.all()
    serializer_class = MealItemSerializer

    def get_queryset(self):
        queryset = super(MealItemDetailsView, self).get_queryset()

        meal_id = self.kwargs.get('meal_id', None)
        if meal_id is not None:
            queryset = queryset.filter(meal_id=meal_id)
        return queryset
    
    # def partial_update()