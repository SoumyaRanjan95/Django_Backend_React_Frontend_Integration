from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *
#from .views import CustomAuthToken, LocationsViewSet, RestaurantUserViewSet, ReservationsViewSet

"""urlpatterns = [
    path("", views.index, name="index"),
]"""


'''router = routers.DefaultRouter()
#router.register(r'users', RestaurantUserViewSet,basename='restaurantuser')
router.register(r'locations', RestaurantViewSet,basename='locations')
#router.register(r'reservations', ReservationsViewSet, basename='reservations')'''






urlpatterns = [

    path('register/', RestaurantUserCreationView.as_view(),name='restaurant_user_creation'),
    path('restaurantuser/',RestaurantUserDetailView.as_view(), name='restaurant_user_detail'), # we are filtering aganist the request.user
    
    path('restaurants/', RestaurantListView.as_view(),name='restaurant_list'),
    path('restaurants/<int:pk>/', RestaurantDetailView.as_view(),name='restaurant_detail'),

    path('reservations/',ReservationsListView.as_view(), name='user_reservations_list'),
    path('reservations/<uuid:uuid>/',ReservationsDetailView.as_view(), name='user_reservations_detail'),

    path('login/',LoginView.as_view(),name='login'),
    path('staff_login/',StaffLoginView.as_view(),name='login'),
    path('logout/',LogoutView.as_view(),name='logout'),

    path('menu/<int:restaurant_pk>/',MenuListView.as_view(),name='menu_list'),
    path('orders/', UserOrdersView.as_view(), name = 'order_list'),

    

    # For staff
    path('update/menu/',MenuAvailableUpdateView.as_view(),name='available_menu_update_list'),
    path('update/menu/<int:pk>/',MenuDetailView.as_view(),name='individual_menu_update'),
    path('process/orders/', OrdersListForRestaurantView.as_view(), name='process_orders_list'),
    path('process/orders/<uuid:uuid>/', OrdersDetailForRestaurantView.as_view(), name='process_orders_detail'),
    path('show_bills/',GenerateBillListView.as_view(), name='show_bill'),
    path('generate_bills/<uuid:order_id>',GenerateBillDetailView.as_view(), name='generate_bill'),


    #path('api-token-auth/', obtain_auth_token),
    #path('restaurant_menu/', RestaurantMenus.as_view())
    #path('', include(router.urls)),
    #path('auth/', CustomAuthToken.as_view(), name='auth'),

]


urlpatterns = format_suffix_patterns(urlpatterns)
