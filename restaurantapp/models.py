from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User, AbstractUser, BaseUserManager, UserManager
from .manager import RestaurantUserManager
import uuid

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)




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
    slot = models.CharField(max_length=9)
    guests = models.IntegerField()
    reservation_at = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    created = models.DateTimeField(default=timezone.now())


class Menu(models.Model):

    VEG_OR_NON_VEG = {
        "veg": "Veg",
        "non_veg": "Non Veg",
    }

    TYPE = {
        "starter": "Starters",
        "drinks": "Drinks",
        "biriyani": "Biriyani",
    }

    name = models.CharField(max_length=90)
    type = models.CharField(max_length=20,choices=TYPE)
    veg_or_nonveg = models.CharField(max_length=10,choices=VEG_OR_NON_VEG)
    price = models.IntegerField()
    info = models.CharField(max_length=120)
    serving_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    available = models.BooleanField(default=True)


class RestaurantStaff(models.Model):
    user = models.OneToOneField(RestaurantUser, on_delete=models.CASCADE)
    staff_of_restaurant = models.OneToOneField(Restaurant, on_delete=models.CASCADE)


class OrderManager(models.Manager):

    def create_with_items_ordered(self, validated_data, items_ordered):
        order = Orders.objects.create(**validated_data)
        order.save()
        user = RestaurantUser.objects.get(mobile=validated_data['user'])
        for item in items_ordered:
            from_restaurant = Restaurant.objects.get(pk=item['from_restaurant'].id)
            menu_id = Menu.objects.get(pk=item['menu_id'].id)
            item_cancelled = item["item_cancelled"]
            quantity = item['quantity']
            create_item = ItemsOrdered(order_id=order,from_restaurant=from_restaurant, menu_id=menu_id,user=user,item_cancelled=item_cancelled,quantity=quantity)
            create_item.save(force_insert=True)
        return order

class Orders(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_datetime = models.DateTimeField(auto_now=True)
    from_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    reservation_token = models.ForeignKey(Reservations,on_delete=models.CASCADE)
    table_no = models.CharField(max_length=10)
    processed = models.BooleanField(default=False)
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)

    objects = models.Manager()
    new_objects = OrderManager()

class ItemsOrdered(models.Model):

    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='items_ordered')
    from_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE) 
    menu_id = models.ForeignKey(Menu,on_delete=models.CASCADE,default=0)
    quantity= models.PositiveIntegerField(default=1)
    item_cancelled = models.BooleanField(default=False)
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)

class Bills(models.Model):
    bill_reference_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False),
    bill_datetime = models.DateTimeField(auto_now=True),
    order_id = models.OneToOneField(Orders, on_delete=models.CASCADE)
    reservation_token = models.ForeignKey(Reservations,on_delete=models.CASCADE)
    processed = models.BooleanField(default=False)
    from_restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE) 
    user = models.ForeignKey(RestaurantUser, on_delete=models.CASCADE)


@receiver(post_save, sender=Orders)
def create_bill(sender, instance=None, created=False, **kwargs):
    if created:
        Bills.objects.create(order_id=instance,reservation_token=instance.reservation_token,from_restaurant=instance.from_restaurant,user=instance.user)

'''class Orders(models.Model):
    reservations= models.ForeignKey(Reservations, on_delete=models.CASCADE)
    orders = models.ManyToManyField(MenuAvailable)'''


