from django.contrib import admin
from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Conversation,
    Message,
)


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Conversation)
admin.site.register(Message)
