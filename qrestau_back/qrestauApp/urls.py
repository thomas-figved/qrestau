from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('login/<int:table_id>', views.AnonymousLoginView.as_view({
        'post': 'login',
    }), name="anonymous-login"),

    path('items', views.ItemsView.as_view({
        'get': 'list',
    }), name="list-items"),

    path('items/<int:pk>', views.ItemsDetailsView.as_view({
        'get': 'retrieve',
    }), name="items-details"),

    path('meals', views.MealView.as_view({
        'get': 'list',
        'post': 'create',
    }), name="list-meals"),

    path('meals/<int:meal_id>', views.MealDetailsView.as_view({
        'get': 'retrieve',
        'patch': 'partial_update',
        'delete': 'close',
    }), name="meal-details"),

    path('meals/<int:meal_id>/meal-items', views.MealItemView.as_view({
        'get': 'list',
        'post': 'create',
    }), name="list-meal-items"),

    path('meals/<int:meal_id>/meal-items/<int:pk>', views.MealItemDetailsView.as_view({
        'get': 'retrieve',
        'patch': 'partial_update',
    }), name="list-meal-items"),

    path('tables', views.TablesView.as_view({
        'get': 'list',
    }), name="list-tables"),
]
