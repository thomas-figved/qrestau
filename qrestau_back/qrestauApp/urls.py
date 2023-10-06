from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from . import views

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

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

    path('check-token', views.CheckTokenView.as_view({
      'get': 'check_token'
    }), name="check-token")
]
