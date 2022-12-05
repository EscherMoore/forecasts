from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from config.settings import API_KEY
import requests
import json
from .serializers import ForecastSerializer
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
@renderer_classes([JSONRenderer])
def forecast(request):

    location = request.GET.get('location')

    # If all values are numbers then it is a zip code
    zip = all(ch.isdigit() for ch in location)

    if not zip:
        cityURL = f'http://api.openweathermap.org/geo/1.0/direct'
        params = {'q': location, 'limit': 1, 'appid': API_KEY}
        cityData = requests.get(cityURL, params)
        if cityData.status_code != 200:
            return Response(cityData.json())

        cityData = cityData.json()[0]
        lat = cityData['lat']
        lon = cityData['lon']
        city = cityData['name']
        country = cityData['country']

    else:
        zipURL = f'http://api.openweathermap.org/geo/1.0/zip'
        params = {'zip': location, 'mode': 'json', 'appid': API_KEY}
        zipData = requests.get(zipURL, params)
        if zipData.status_code != 200:
            return Response(zipData.json())

        zipData = zipData.json()
        lat = zipData['lat']
        lon = zipData['lon']
        city = zipData['name']
        country = zipData['country']

    onecall_api_endpoint = f'https://api.openweathermap.org/data/2.5/onecall'
    onecall_api_params = {'lat': lat, 'lon': lon, 'units': 'imperial', 'appid': API_KEY}
    weatherData = requests.get(onecall_api_endpoint, onecall_api_params)

    weatherData = weatherData.json()
    weatherData['city'] = city 
    weatherData['country'] = country 
    return Response(weatherData)



class GoogleLogin(SocialLoginView): # if you want to use Authorization Code Grant, use this
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:3000'
    client_class = OAuth2Client


@api_view(['GET'])
def user_saves(request):
    if request.method == 'GET':
        User = get_user_model()
        Token = request.auth

        user = User.objects.get(auth_token=Token)
        user_forecasts = user.forecasts.all()
        if len(user_forecasts) == 0:
            return JsonResponse({})

        forecasts_serializer = ForecastSerializer(user_forecasts, many=True)
        forecasts_json = JSONRenderer().render(forecasts_serializer.data)
        return HttpResponse(forecasts_json)
    return HttpResponse(status=204)