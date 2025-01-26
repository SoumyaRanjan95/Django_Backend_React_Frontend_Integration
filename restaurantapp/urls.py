from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *


"""

URLs for accessing the API For Regular User (to be used in react Frontend
api/is_authenticated/ - to check if the user is authenticated
api/csrf/ - to obtain the csrf token
api/regsiter/ - register a user 
api/restaurantuser/ - get the details about the currently logged in user
api/restaurants/ - get the list of restaurants
api/restaurants/pk/ - details about the restaurant
api/reservations/ - get the list of the user reservations
api/reservations/ - get the details of the user reservations
api/reservations/ - login a user
api/logout/ - logout a user
api/menu/restaurant_pk - restaurant specific menu details
api/orders/ - send user orders

"""

urlpatterns = [

    path('is_authenticated/',IsAuthenticatedView.as_view(),name="authenticated"),
    path('csrf/',GetCSRFToken.as_view(),name="csrf_token"),
    path('register/', RestaurantUserCreationView.as_view(),name='restaurant_user_creation'),
    path('restaurantuser/',RestaurantUserDetailView.as_view(), name='restaurant_user_detail'),
    
    path('restaurants/', RestaurantListView.as_view(),name='restaurant_list'),
    path('restaurants/<int:pk>/', RestaurantDetailView.as_view(),name='restaurant_detail'),

    path('reservations/',ReservationsListView.as_view(), name='user_reservations_list'),
    path('reservations/<uuid:uuid>/',ReservationsDetailView.as_view(), name='user_reservations_detail'),

    path('login/',LoginView.as_view(),name='login'),
    path('logout/',LogoutView.as_view(),name='logout'),

    path('menu/<int:restaurant_pk>/',MenuListView.as_view(),name='menu_list'),
    path('orders/', UserOrdersView.as_view(), name = 'order_list'),

    # For staff
    path('staff_login/',StaffLoginView.as_view(),name='staff_login'),
    path('staff_is_authenticated/',StaffIsAuthenticatedView.as_view(),name="authenticated"),
    path('update/menu/',MenuAvailableUpdateView.as_view(),name='available_menu_update_list'),
    path('update/menu/<int:pk>/',MenuDetailView.as_view(),name='individual_menu_update'),
    path('process/orders/', OrdersListForRestaurantView.as_view(), name='process_orders_list'),
    path('process/orders/<uuid:uuid>/', OrdersDetailForRestaurantView.as_view(), name='process_orders_detail'),
    path('bills_list/',BillListsView.as_view(), name='generate_bill'),
    path('process_bills/<uuid:order_id>/', ProcessBillsView.as_view(), name='process_bills')


]

    
"""
    URLS for accessing the Api for the Staffs (to be used in React Frontend)
    api/staff_login/ - login a staff
    api/staff_is_authenticated/ - to check if the staff is authenticated or not
    api/update/menu/ - update the restaurant specific menu by the staff
    api/update/menu/pk/ - update the menu datails
    api/process/orders/ - api to get orders list
    api/process/orders/uuid/ - get the order details
    api/bills_list/ - get the bills list
    api/process_bills/order_id/ - process bills

"""


urlpatterns = format_suffix_patterns(urlpatterns)
