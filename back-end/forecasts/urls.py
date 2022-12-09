from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'saves', ForecastViewSet, basename='saves')

urlpatterns = [
    path('forecast', forecast, name="forecast"),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/google/', GoogleLogin.as_view(), name='google_login')
]

urlpatterns += router.urls