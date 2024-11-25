from django.shortcuts import render
from django.http import JsonResponse, Http404
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView,CreateAPIView
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
    authentication_classes = (SessionAuthentication,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(mobile=serializer.validated_data["mobile"],password=serializer.validated_data["password"])
            print(user)
            if user:
                login(request, user)            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    

    
class MenuListView(APIView):

    serializer_class = MenuSerializer
    permission_classes =  [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, format=None):
        menu = Menu.objects.all()
        serializer = MenuSerializer(menu, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MenuDetailView(APIView):
    serializer_class = MenuSerializer
    permission_classes =  [permissions.IsAuthenticatedOrReadOnly]
    """
    Retrieve, update or delete a snippet instance.
    """
    def get_object(self, pk):
        try:
            return Menu.objects.get(pk=pk)
        except Menu.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        menu = self.get_object(pk)
        serializer = MenuSerializer(menu)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        menu = self.get_object(pk)
        serializer = MenuSerializer(menu, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        menu = self.get_object(pk)
        menu.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    



    
class OrdersListViewUser(APIView):

    def get_object(self, request):
        instance = RestaurantUser.objects.get(mobile=request.user)
        return Orders.objects.filter(user=instance.id)
    def get(self, request, format=None):
        menu = self.get_object(request)
        serializer = MenuSerializer(menu, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, format=None):
        menu = self.get_object(request)
        menu.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrdersListViewRestaurant(APIView):

    # serializer_class = [''] write a custom serializer class for the Restaurant User

    def get_object(self,request):
        instance = RestaurantUser.objects.get(mobile=request.user)
        return Orders.objects.filter()

    def get(self, request, format=None):
        menu = Menu.objects.all()
        serializer = MenuSerializer(menu, many=True)
        return Response(serializer.data)

    def patch(self, request, format=None):
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

















