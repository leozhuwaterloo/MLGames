from django.contrib import admin
from django.conf.urls import url, include
from . import views

urlpatterns = [
    url('', views.index, name="index"),
    url(r'^.*/$', views.index)
]
