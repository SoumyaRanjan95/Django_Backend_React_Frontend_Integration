from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from .views import SignUpView, GetCSRFToken, LoginView, LogoutView, CheckAutheticatedView, ReserveTableView

from .views import LocationsViewSet
#from .views import CustomAuthToken, LocationsViewSet, RestaurantUserViewSet, ReservationsViewSet

"""urlpatterns = [
    path("", views.index, name="index"),
]"""


router = routers.DefaultRouter()
#router.register(r'users', RestaurantUserViewSet,basename='restaurantuser')
router.register(r'locations', LocationsViewSet,basename='locations')
#router.register(r'reservations', ReservationsViewSet, basename='reservations')






urlpatterns = [
    path('', include(router.urls)),
    #path('auth/', CustomAuthToken.as_view(), name='auth'),
    path('register', SignUpView.as_view()),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('authenticated', CheckAutheticatedView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('reserve',ReserveTableView.as_view()),
    path('api-token-auth/', obtain_auth_token),

]


