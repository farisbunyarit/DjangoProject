from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Product, Category


# =========================
# PRODUCT SERIALIZER
# =========================

class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product

        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'image',
            'badge',
            'badge_class',
            'icon',
        ]


# =========================
# CATEGORY SERIALIZER
# =========================

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category

        fields = [
            'id',
            'name',
            'icon',
        ]


# =========================
# USER SERIALIZER
# =========================

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            'id',
            'username',
            'email',
            'is_active',
            'is_staff',
            'date_joined',
        ]

        read_only_fields = [
            'id',
            'date_joined',
        ]
