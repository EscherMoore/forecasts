from rest_framework import serializers
from .models import Forecast 


class ForecastSerializer(serializers.ModelSerializer):

    class Meta:
        model = Forecast 
        fields = '__all__'
        read_only_fields = ['user']