from rest_framework.permissions import BasePermission
from .models import RestaurantUser, RestaurantStaff

class IsRestaurantStaff(BasePermission):

    message = "Only Restaurant Staff Allowed Access"

    def has_permission(self, request, view):
        restaurant_staff_instance = RestaurantUser.objects.get(mobile=request.user)
        staff_of = RestaurantStaff.objects.get(user = restaurant_staff_instance).staff_of_restaurant

        if restaurant_staff_instance.is_staff and staff_of is not None:
            return True
        else:
            return False


