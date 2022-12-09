from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings


class Forecast(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="forecasts")
    formatted_address = models.CharField(max_length=240, blank=False)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user}: {self.formatted_address}"