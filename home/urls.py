from django.urls import path
from . import views


urlpatterns = [

    # =========================
    # STORE
    # =========================

    path(
        '',
        views.home,
        name='home'
    ),


    # =========================
    # AUTHENTICATION
    # =========================

    path(
        'register/',
        views.register,
        name='register'
    ),

    path(
        'login-redirect/',
        views.login_redirect,
        name='login_redirect'
    ),


    # =========================
    # ADMIN DASHBOARD
    # =========================

    path(
        'dashboard/',
        views.admin_dashboard,
        name='admin_dashboard'
    ),


    # =========================
    # USER MANAGEMENT
    # =========================

    path(
        'dashboard/users/',
        views.admin_users,
        name='admin_users'
    ),

    path(
        'dashboard/users/<int:user_id>/edit/',
        views.edit_user,
        name='edit_user'
    ),

    path(
        'dashboard/users/<int:user_id>/password/',
        views.change_user_password,
        name='change_user_password'
    ),

    path(
        'dashboard/users/<int:user_id>/delete/',
        views.delete_user,
        name='delete_user'
    ),


    # =========================
    # PRODUCT MANAGEMENT
    # =========================

    path(
        'dashboard/products/',
        views.admin_products,
        name='admin_products'
    ),

    path(
        'dashboard/products/add/',
        views.add_product,
        name='add_product'
    ),

    path(
        'dashboard/products/<int:product_id>/edit/',
        views.edit_product,
        name='edit_product'
    ),

    path(
        'dashboard/products/<int:product_id>/delete/',
        views.delete_product,
        name='delete_product'
    ),


    # =========================
    # REST API
    # =========================

    path(
        'api/products/',
        views.product_api,
        name='product_api'
    ),

    path(
        'api/categories/',
        views.category_api,
        name='category_api'
    ),

    path(
        'api/users/',
        views.user_api,
        name='user_api'
    ),

    path(
        'api/ai/',
        views.ai_api,
        name='ai_api'
    ),


    # =========================
    # CART
    # =========================

    path(
        'add-to-cart/',
        views.add_to_cart,
        name='add_to_cart'
    ),

    path(
        'update-cart/',
        views.update_cart,
        name='update_cart'
    ),

    path(
        'remove-from-cart/',
        views.remove_from_cart,
        name='remove_from_cart'
    ),

    path(
        'clear-cart/',
        views.clear_cart,
        name='clear_cart'
    ),

    path(
      'checkout/',
       views.checkout,
       name='checkout'
    ),


]
