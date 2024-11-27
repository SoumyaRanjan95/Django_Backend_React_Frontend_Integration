from django.shortcuts import render
from django.http import JsonResponse, Http404
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView,CreateAPIView, ListCreateAPIView
from rest_framework import viewsets
from .models import RestaurantUser, Reservations, Restaurant, Menu
from rest_framework.decorators import api_view
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from django.contrib.auth import authenticate
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from django.utils.decorators import method_decorator
from django.contrib.auth import login, logout, authenticate
from django.core import serializers

from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from .backends import MobileBackend
from .permissions import IsRestaurantStaff



class RestaurantListView(APIView):

    def get(self, request, format=None):
        restaurant = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurant, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RestaurantDetailView(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return Restaurant.objects.get(pk=pk)
        except Restaurant.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        restaurant = self.get_object(pk)
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        restaurant = self.get_object(pk)
        serializer = RestaurantSerializer(restaurant, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        restaurant = self.get_object(pk)
        restaurant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class RestaurantUserCreationView(APIView):
    serializer_class = RestaurantUserCreationSerializer
    permission_classes = [permissions.AllowAny]

    """
        USe this View for Signing Up
    """
    """ See Django Rest FrameWork Docs  --- serializers"""
    
    '''
        .save() will create a new instance.
        serializer = CommentSerializer(data=data) # this feature is copied in POST below for CREATE
    '''
    
    
    def post(self, request, format=None):
        serializer = RestaurantUserCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["password"] = make_password(serializer.validated_data["password"]) # serializer create and update not hasing passwords
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

class RestaurantUserDetailView(APIView):   # we can also use the  Retrieve API for the read-only behaviour and Update APIview for update endpoints

    serializer_class = RestaurantUserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, request):
        try:
            return RestaurantUser.objects.get(mobile=request.user)
        except RestaurantUser.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        restaurantUser = self.get_object(request)
        serializer = RestaurantUserDetailSerializer(restaurantUser)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    
    '''
        .save() will update the existing `comment` instance.
        serializer = CommentSerializer(comment, data=data) # this feature is in PUT for UPDATE 
    '''
    def put(self, request, format=None):
        restaurantUser = self.get_object(request)
        serializer = RestaurantUserDetailSerializer(restaurantUser, data=request.data)
        if serializer.is_valid():
            serializer.validated_data["password"] = make_password(serializer.validated_data["password"])
            serializer.save()
            return Response(serializer.data , status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        restaurantUser = self.get_object(request)
        restaurantUser.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class ReservationsListView(APIView):

    serializer_class = ReservationsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, request):
        try:
            instance = RestaurantUser.objects.get(mobile=request.user)
            return Reservations.objects.filter(user=instance.id)
        except Reservations.DoesNotExist:
            raise Http404

    def get(self, request,format=None):
        reservations = self.get_object(request)
        serializer = ReservationsSerializer(reservations, many=True)
        return Response(serializer.data)

    def post(self, request,format=None):
        print(request.data)
        serializer = ReservationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["user"] = RestaurantUser.objects.get(mobile=request.user) # self populate
            ''' If the line above this doc string is not mentioned then the Integrity NOT NULL constraint shows up
                because when the post request is coming from the frontend where in the browsable api because of the
                read_only_fields the id attribute is not present in the post request, so we have to explicitly mention
                the user id after querying the RestaurantUser model for request.user 's presence.   
            '''
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReservationsDetailView(APIView):

    serializer_class = ReservationsSerializer
    permission_classes = [permissions.IsAuthenticated]
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, request, uuid):
        try:
            instance = RestaurantUser.objects.get(mobile=request.user)
            return Reservations.objects.get(user=instance.id, reservation_token=uuid)
        except Reservations.DoesNotExist:
            raise Http404

    def get(self, request, uuid, format=None):
        reservations = self.get_object(request,uuid)
        serializer = ReservationsSerializer(reservations)
        return Response(serializer.data)

    def put(self, request, uuid ,format=None):
        reservations = self.get_object(request,uuid)
        serializer = ReservationsSerializer(reservations, data=request.data)
        if serializer.is_valid():
            serializer.validated_data["user"] = RestaurantUser.objects.get(mobile=request.user) # self populate
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        reservations = self.get_object(request)
        reservations.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class LoginView(APIView): # Write custom authentication or use the Token/Session authentication

    serializer_class = LoginSerializer
    permission_classes =  [permissions.AllowAny]
    #authentication_classes = (SessionAuthentication,)

    def post(self, request, format=None):
        #serializer = LoginSerializer(data=request.data)
        #if serializer.is_valid():
        user = authenticate(mobile=request.data["mobile"],password=request.data["password"])
        if user:
            login(request, user)       
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST) 


class StaffLoginView(APIView): # Write custom authentication or use the Token/Session authentication

    serializer_class = LoginSerializer
    permission_classes =  [permissions.AllowAny]
    #authentication_classes = (SessionAuthentication,)

    def post(self, request, format=None):
        user = authenticate(mobile=request.data["mobile"],password=request.data["password"])
        isRestaurantStaffOf = RestaurantStaff.objects.get(user = user).staff_of_restaurant
        if user.is_staff and isRestaurantStaffOf is not None:
            login(request, user)      
            print(isRestaurantStaffOf)      
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)  
 
    
class LogoutView(APIView):

    serializer_classes = None

    def get(self, request):
        logout(request)
        request.user = None
        request.auth = None
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class MenuListView(APIView):

    serializer_class = MenuSerializer
    permission_classes =  [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, restaurant_pk):
        restaurant_instance = Restaurant.objects.get(id=restaurant_pk)
        print(restaurant_instance)
        return Menu.objects.filter(serving_restaurant=restaurant_instance.id)

    def get(self, request,restaurant_pk, format=None):
        menu = self.get_object(restaurant_pk)
        serializer = MenuSerializer(menu, many=True)
        return Response(serializer.data)

    '''def post(self, request, format=None):
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)'''
class MenuAvailableUpdateView(APIView):
    serializer_class = MenuSerializer
    permission_classes =  [permissions.IsAdminUser]
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, request):
        instance = RestaurantUser.objects.get(mobile=request.user)
        restaurant = RestaurantStaff.objects.get(user = instance.id).staff_of_restaurant
        return Menu.objects.filter(serving_restaurant=restaurant.id)

    def get(self, request, format=None):
        menu = self.get_object(request)
        serializer = MenuSerializer(menu,many=True)
        return Response(serializer.data)

    def put(self, request, format=None):
        menu = self.get_object(request)
        serializer = MenuSerializer(menu, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MenuDetailView(APIView):
    serializer_class = MenuSerializer
    permission_classes =  [permissions.IsAdminUser]
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self,request,pk):
        instance = RestaurantUser.objects.get(mobile=request.user)
        restaurant = RestaurantStaff.objects.get(user = instance.id).staff_of_restaurant
        return Menu.objects.get(id=pk,serving_restaurant=restaurant.id)

    def get(self, request, pk, format=None):
        menu = self.get_object(request,pk)
        serializer = MenuSerializer(menu)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        menu = self.get_object(request,pk)
        serializer = MenuSerializer(menu, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        menu = self.get_object(request,pk)
        menu.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    



    
class UserOrdersView(APIView):
    serializer_class = OrdersSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, request):
        instance = RestaurantUser.objects.get(mobile=request.user)
        return Orders.objects.filter(user=instance.id)
    def get(self, request, format=None):
        order = self.get_object(request)
        serializer = OrdersSerializer(order, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = OrdersSerializer(data=request.data, context = {"request":request})
        if serializer.is_valid():
            instance = Restaurant.objects.get(id = serializer.validated_data['from_restaurant'].id)
            reservation_exists = Reservations.objects.filter(reservation_token=serializer.validated_data['reservation_token'].reservation_token,reservation_at=instance.id).exists()
            if reservation_exists:
                serializer.validated_data["user"] = RestaurantUser.objects.get(mobile=request.user) # self populate
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, format=None):
        order = self.get_object(request)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrdersListForRestaurantView(APIView):
    serializer_class = OrdersSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self,request):
        instance = RestaurantUser.objects.get(mobile=request.user)
        restaurant = RestaurantStaff.objects.get(user = instance.id).staff_of_restaurant
        return Orders.objects.filter(from_restaurant=restaurant.id)

    def get(self, request, format=None):
        orders = self.get_object(request)
        serializer = OrdersSerializer(orders,many=True) #context={'request': request} 
        return Response(serializer.data)
    

class OrdersDetailForRestaurantView(APIView):
    serializer_class = OrdersSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self,request,uuid):
        instance = RestaurantUser.objects.get(mobile=request.user)
        restaurant = RestaurantStaff.objects.get(user = instance.id).staff_of_restaurant
        return Orders.objects.get(from_restaurant=restaurant.id,order_id=uuid)

    def get(self, request,uuid ,format=None):
        orders = self.get_object(request,uuid)
        serializer = OrdersSerializer(orders)
        return Response(serializer.data)


    def patch(self, request,uuid, format=None):
        order = self.get_object(request,uuid)
        serializer = OrdersSerializer(order, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ItemsOrderedSerializer(ListCreateAPIView):

    serializer_class = ItemsOrderedSerializer
    permission_classes = [permissions.IsAdminUser]


    def get(self,request, format=None):
        item = ItemsOrdered.objects.all()
        serializer = ItemsOrderedSerializer(item, many=True)
        return Response(serializer.data,status=status.HTTP_201_CREATED)

    def post(self, request, format=None):
        serializer = ItemsOrderedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class GenerateBillListView(APIView):

    serializer_class = BillsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self,request):
        instance = RestaurantUser.objects.get(mobile=request.user)
        restaurant = RestaurantStaff.objects.get(user = instance.id).staff_of_restaurant
        return Bills.objects.filter(from_restaurant=restaurant.id)

    def get(self,request, format=None):
        bills = self.get_object(request)
        serializer = BillsSerializer(bills, many=True)
        return Response(serializer.data,status=status.HTTP_201_CREATED)

    

class GenerateBillDetailView(APIView):

    serializer_class = BillsSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_object(self,request,order_id):
        instance = RestaurantUser.objects.get(mobile=request.user)
        restaurant = RestaurantStaff.objects.get(user = instance.id).staff_of_restaurant
        order=Orders.objects.get(order_id=order_id)
        return Bills.objects.get(order_id=order)
    
    def get(self,request,order_id):
        bill = self.get_object(request,order_id)
        serializer = BillsSerializer(bill)
        return Response(serializer.data,status=status.HTTP_201_CREATED)


    def patch(self, request,order_id, format=None):
        bills = self.get_object(request,order_id)
        serializer = BillsSerializer(bills,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)











