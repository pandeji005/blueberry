from rest_framework import serializers
from .models import Restaurant, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MenuItem
        fields = ['id', 'name', 'price']

class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    class Meta:
        model  = Restaurant
        fields = ['id', 'name', 'category', 'image', 'menu_items']