from django.db import models
from django.contrib.auth.models import User, AbstractUser

class AppUser(User):
    class Meta:
        abstract = True
        

class RestaurantUser(AbstractUser):
    mobile = models.CharField(max_length=10)

class Locations(models.Model):
    restaurant = models.CharField(max_length=90)
    city = models.CharField(max_length=30)

class Reservations(models.Model):
    name = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE, default="", related_name="rest_user_name")
    date = models.DateField()
    guests = models.IntegerField()
    location = models.ForeignKey(Locations, on_delete=models.CASCADE,related_name="restaurant_location")

