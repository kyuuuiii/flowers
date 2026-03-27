from django.contrib import admin
from .models import Category, Products, Review, Order, OrderItem

admin.site.register(Category)
admin.site.register(Products)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)