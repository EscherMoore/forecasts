from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

class Forecast(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="forecasts")
    name = models.CharField(max_length=240, blank=False)
    country = models.CharField(max_length=240, blank=False)

    def __str__(self):
        return f"{self.user}: {self.name}, {self.country}"