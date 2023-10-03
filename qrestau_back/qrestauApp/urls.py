from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('items', views.ItemsView.as_view({
      'get': 'list',
    }), name="list-items"),
]
