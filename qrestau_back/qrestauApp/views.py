from django.shortcuts import render, get_object_or_404
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework import generics, viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from django_filters.rest_framework import DjangoFilterBackend


from .models import Item, Meal, Table, MealItem, Category
from .serializers import ItemSerializer, MealSerializer, MealItemSerializer, TableSerializer, UserSerializer, CategorySerializer
from .helpers import build_username
from .permissions import IsStaff, IsMealUser

class ItemsView(viewsets.ModelViewSet):
    model = Item
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class ItemsDetailsView(viewsets.ModelViewSet):
    model = Item
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class CategoriesView(viewsets.ModelViewSet):
    model = Category
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MealView(viewsets.ModelViewSet):
    model = Meal
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_closed']
    ordering = ['start_datetime']
    permission_classes = [IsStaff]

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
            table = table,
            password = password,
        )

        new_meal.save()

        #We create an anonymous user that will be used by the customers joining the meal
        user = User.objects.create_user(
            username=build_username(new_meal.id),
            email='customer@customer.com',
            password=password
        )
        new_meal.anonymous_user = user
        new_meal.save()


        return Response({"message": "Meal started successfully"}, status.HTTP_201_CREATED)


class MealDetailsView(viewsets.ModelViewSet):
    model = Meal
    queryset = Meal.objects.all()
    serializer_class = MealSerializer
    lookup_url_kwarg = "meal_id"

    def close(self, request, meal_id):
        to_close_meal = Meal.objects.get(pk=meal_id)
        to_close_meal.is_closed=True
        to_close_meal.end_datetime=now()
        to_close_meal.save()

        return Response({"message": "Meal successfully closed"}, status.HTTP_200_OK)

    def check_permissions(self, request):
        if request.method in ['PATCH','DELETE']:
            self.permission_classes = [IsStaff]
        else :
            self.permission_classes = (IsStaff|IsMealUser,)
        return super().check_permissions(request)

class MealItemView(viewsets.ModelViewSet):
    model = MealItem
    queryset = MealItem.objects.all()
    serializer_class = MealItemSerializer
    permission_classes = (IsStaff|IsMealUser,)

    def get_queryset(self):
        queryset = super(MealItemView, self).get_queryset()

        meal_id = self.kwargs.get('meal_id', None)
        if meal_id is not None:
            queryset = queryset.filter(meal_id=meal_id)
        return queryset

    def create(self, request, meal_id):
        meal = get_object_or_404(Meal, id=meal_id) #throw 404 if resource doesn't exist

        if(isinstance(request.data, list)):

            for request_item in request.data:
                

                item_id = request_item['item_id']
                item = get_object_or_404(Item, id=item_id) #throw 404 if resource doesn't exist
               
                qty = request_item['qty']

                new_meal_item = MealItem.objects.create(
                    meal = meal,
                    item = item,
                    qty = qty,
                    price = item.price,
                    ordered_at = now(),
                    is_delivered = False,
                )

                new_meal_item.save()

                message = "Items have been added to the meal"

        else:

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

            message = "Item has been added to the meal"


        return Response({"message": message}, status.HTTP_201_CREATED)

class MealItemDetailsView(viewsets.ModelViewSet):
    model = MealItem
    queryset = MealItem.objects.all()
    serializer_class = MealItemSerializer
    permission_classes = (IsStaff,)


    def get_queryset(self):
        queryset = super(MealItemDetailsView, self).get_queryset()

        meal_id = self.kwargs.get('meal_id', None)
        if meal_id is not None:
            queryset = queryset.filter(meal_id=meal_id)
        return queryset

class TablesView(viewsets.ModelViewSet):
    model = Table
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = (IsStaff,)

    def get_queryset(self):
        queryset = super(TablesView, self).get_queryset()

        is_available = self.request.query_params.get('is_available')
        if(is_available == "1"):

            #we get the current open meals
            open_meals = Meal.objects.filter(is_closed = 0)

            #we exclude tables that have an open meal on them
            queryset = queryset.exclude(id__in = [meal.table.id for meal in open_meals])
        return queryset

class TableDetailsView(viewsets.ModelViewSet):
    model = Table
    queryset = Table.objects.all()
    serializer_class = TableSerializer
    permission_classes = (IsStaff,)

class AnonymousLoginView(viewsets.ModelViewSet):
    def login(self, request, table_id):
        table = get_object_or_404(Table, id=table_id)

        password = request.data.get('password')

        meal = get_object_or_404(Meal, table = table, is_closed = False)

        if password == "" or meal.password!=password:
            return Response({"message": "Incorrect password."}, status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=build_username(meal.id), password=password)

        if user is None:
            return Response({"message": "Incorrect password."}, status.HTTP_401_UNAUTHORIZED)

        token, created = Token.objects.get_or_create(user=user)

        return Response({'auth_token': token.key,'meal_id':meal.id}, status.HTTP_200_OK)

class CheckTokenView(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    model = User
    serializer_class = UserSerializer

    def check_token(self, request):
        is_staff = len(request.user.groups.filter(name="staff")) > 0

        if(not is_staff):
           #if not staff we have to check for the meal ID to know where we will redirect the user
           pass

        serialized_user = self.get_serializer(request.user)

        return Response({'is_staff': is_staff, 'user': serialized_user.data}, status.HTTP_200_OK)
