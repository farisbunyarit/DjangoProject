from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    # =========================
    # DJANGO ADMIN
    # =========================

    path(
        'admin/',
        admin.site.urls
    ),


    # =========================
    # HOME APPLICATION
    # =========================

    path(
        '',
        include('home.urls')
    ),


    # =========================
    # AUTHENTICATION
    # =========================

    path(
        'accounts/',
        include('django.contrib.auth.urls')
    ),

]
