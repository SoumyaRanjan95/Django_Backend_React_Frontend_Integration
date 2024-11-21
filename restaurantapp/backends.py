from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from .models import RestaurantUser

class MobileBackend(ModelBackend):
    def authenticate(self, request, mobile, password, **kwargs):

        try:
            user = RestaurantUser.objects.get(mobile=mobile)
        except:
            return None
        else:
            if user.check_password(password):
                return user
        return None