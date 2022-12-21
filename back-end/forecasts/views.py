from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes, renderer_classes, action
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from config.settings import OPEN_WEATHER_MAP_API_KEY, GOOGLE_GEOCODING_API_KEY
import requests
import json
from .serializers import ForecastSerializer
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import viewsets
from .models import Forecast
from django.shortcuts import get_object_or_404
from rest_framework import status


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
@renderer_classes([JSONRenderer])
def forecast(request):

    location = request.GET.get('location')

    geocoding_url = 'https://maps.googleapis.com/maps/api/geocode/json'
    params = {'address': location, 'key': GOOGLE_GEOCODING_API_KEY}

    response = requests.get(geocoding_url, params)
    google_geocoding_data = response.json()

    if len(google_geocoding_data['results']) == 0:
        return Response(google_geocoding_data['results'])

    # Only save the first result in the dataset
    google_geocoding_data = google_geocoding_data['results'][0]

    formatted_address = google_geocoding_data['formatted_address']
    lat = google_geocoding_data['geometry']['location']['lat']
    lon = google_geocoding_data['geometry']['location']['lng']

    onecall_api_endpoint = f'https://api.openweathermap.org/data/2.5/onecall'
    onecall_api_params = {'lat': lat, 'lon': lon, 'units': 'imperial', 'appid': OPEN_WEATHER_MAP_API_KEY}
    weather_data = requests.get(onecall_api_endpoint, onecall_api_params)

    weather_data = weather_data.json()
    weather_data['formatted_address'] = formatted_address

    return Response(weather_data)



class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:3000'
    client_class = OAuth2Client



class ForecastViewSet(viewsets.ModelViewSet):
    serializer_class = ForecastSerializer

    def get_queryset(self):
        User = get_user_model()
        Token = self.request.auth
        user = User.objects.get(auth_token=Token)
        user_forecasts = user.forecasts.all()
        
        return user_forecasts.order_by('-date_added')


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        User = get_user_model()
        Token = self.request.auth
        user = User.objects.get(auth_token=Token)

        if len(user.forecasts.all()) < 5:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.data, status=status.HTTP_403_FORBIDDEN)


    def perform_create(self, serializer):
        User = get_user_model()
        Token = self.request.auth
        user = User.objects.get(auth_token=Token)
        serializer.save(user=user)


    def retrieve(self, request, pk=None):
        User = get_user_model()
        Token = self.request.auth
        user = User.objects.get(auth_token=Token)
        queryset = user.forecasts.all()

        forecast = get_object_or_404(queryset, pk=pk)
        serializer = ForecastSerializer(forecast)
        return Response(serializer.data)


    def destroy(self, request, pk=None):
        User = get_user_model()
        Token = self.request.auth
        user = User.objects.get(auth_token=Token)
        queryset = user.forecasts.all()

        forecast = get_object_or_404(queryset, pk=pk)
        forecast.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)