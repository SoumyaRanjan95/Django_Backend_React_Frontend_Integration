from django.contrib import admin
from .models import * #RestaurantUser, Reservations, Restaurant, Menu, RestaurantStaff
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin





from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import RestaurantUser


class RestaurantUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = RestaurantUser
    list_display = ("mobile", "is_staff", "is_active",)
    list_filter = ("mobile", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("mobile", "password",'email','fullname')}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "mobile", "password1", "password2",'email','fullname', "is_staff",
                "is_active", "groups", "user_permissions"
            )}
        ),
    )
    search_fields = ("mobile",)
    ordering = ("mobile",)


admin.site.register(RestaurantUser, RestaurantUserAdmin)
admin.site.register(Reservations)
admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(RestaurantStaff)
admin.site.register(Orders)
admin.site.register(ItemsOrdered)
admin.site.register(Bills)
