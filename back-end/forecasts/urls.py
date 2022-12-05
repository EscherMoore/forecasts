from django.urls import path, include
from .views import *

urlpatterns = [
    path('forecast', forecast, name="forecast"),
    path('saves', user_saves, name="saves"),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/google/', GoogleLogin.as_view(), name='google_login')
]