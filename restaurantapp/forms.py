from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import RestaurantUser


class CustomUserCreationForm(UserCreationForm):

    class Meta:
        model = RestaurantUser
        fields = ("mobile",)


class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = RestaurantUser
        fields = ("mobile",)