from django.urls import path
from .views import *

urlpatterns = [
    path('forecast', forecast, name="forecast"),
]