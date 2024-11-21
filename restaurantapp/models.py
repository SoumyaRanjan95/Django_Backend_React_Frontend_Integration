from django.db import models
from django.contrib.auth.models import User, AbstractUser, BaseUserManager, UserManager
from .manager import RestaurantUserManager

class RestaurantUser(AbstractUser):
    username = None
    mobile = models.CharField(max_length=15, unique=True)
    fullname = models.CharField(max_length=90, default='name')
    email = models.EmailField(max_length=90)
    USERNAME_FIELD = 'mobile'
    objects = RestaurantUserManager()


class Locations(models.Model):
    restaurant = models.CharField(max_length=90)
    city = models.CharField(max_length=30)

class Reservations(models.Model):
    name = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE, default="", related_name="rest_user_name")
    date = models.DateField()
    slot = models.TimeField()
    guests = models.IntegerField()
    location = models.ForeignKey(Locations, on_delete=models.CASCADE,related_name="restaurant_location")
    reservation_token = models.CharField(max_length=15, default='it')


class Menu(models.Model):
    name = models.CharField(max_length=90)
    type = models.CharField(max_length=20)
    vegnoveg = models.CharField(max_length=10)
    price = models.IntegerField()
    info = models.CharField(max_length=120)
    serving_restaurant = models.ManyToManyField(Locations)

class MenuAvailable(models.Model):
    menu_item = models.ForeignKey(Menu, on_delete=models.CASCADE)
    available = models.BooleanField()
    restaurant = models.ForeignKey(Locations, on_delete=models.CASCADE)

