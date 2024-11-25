from django.db import models
from django.contrib.auth.models import User, AbstractUser, BaseUserManager, UserManager
from .manager import RestaurantUserManager
import uuid

class RestaurantUser(AbstractUser):
    username = None
    mobile = models.CharField(max_length=15, unique=True)
    fullname = models.CharField(max_length=90, default='name')
    email = models.EmailField(max_length=90)
    USERNAME_FIELD = 'mobile'
    objects = RestaurantUserManager()


class Restaurant(models.Model):
    #restaurant_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    restaurant = models.CharField(max_length=90)
    city = models.CharField(max_length=30)
    address = models.CharField(max_length=126)

class Reservations(models.Model):
    reservation_token = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE, default="")
    date = models.DateField()
    slot = models.TimeField()
    guests = models.IntegerField()
    reservation_at = models.ForeignKey(Restaurant, on_delete=models.CASCADE)


class Menu(models.Model):

    name = models.CharField(max_length=90)
    type = models.CharField(max_length=20)
    veg_or_nonveg = models.CharField(max_length=10)
    price = models.IntegerField()
    info = models.CharField(max_length=120)
    serving_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    available = models.BooleanField(default=True)


class RestaurantStaff(models.Model):
    user = models.OneToOneField(RestaurantUser, on_delete=models.CASCADE)
    staff_of_restaurant = models.OneToOneField(Restaurant, on_delete=models.CASCADE)

class Orders(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order_datetime = models.DateTimeField(auto_now=True)
    from_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    reservation_token = models.CharField(max_length=90)
    table_no = models.CharField(max_length=10)
    processed = models.BooleanField(default=False)
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)

class ItemsOrdered(models.Model):

    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)
    from_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE) 
    item = models.CharField(max_length=30)
    item_type = models.CharField(max_length=15)
    veg_or_nonveg = models.CharField(max_length=15)
    quantity = models.IntegerField()
    item_price_from_restaurant = models.IntegerField() 
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)

class Bills(models.Model):
    bill_reference_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False),
    bill_datetime = models.DateTimeField(auto_now=True),
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE)
    processed = models.BooleanField(default=False)
    from_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE) 
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)




'''class Orders(models.Model):
    reservations= models.ForeignKey(Reservations, on_delete=models.CASCADE)
    orders = models.ManyToManyField(MenuAvailable)'''