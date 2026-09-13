from django.contrib import admin
from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Conversation,
    Message,
    Order,
    OrderItem,
)


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(Order)
admin.site.register(OrderItem)
