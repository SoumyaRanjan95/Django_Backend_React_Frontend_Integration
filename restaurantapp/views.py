from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import RestaurantUser, Reservations, Locations
from rest_framework.decorators import api_view
from .serializers import RestaurantUserSerializer, ReservationsSerializer, LoginSerializer, LocationsSerializer
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
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

#@method_decorator(csrf_protect, name='dispatch')
class CheckAutheticatedView(APIView):
    def get(self,request):
        isAuthenticated = RestaurantUser.is_authenticated

        if isAuthenticated:
            return Response({"isAuthenticated":"Success"})
        else:
            return Response({"isAuthenticated":"Error"})
        
#@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):

    #permission_classes = (permissions.AllowAny, )
    def post(self, request):
        data = self.request.data

        mobile = data['mobile']
        password = data['password']

        user = MobileBackend().authenticate(request, mobile=mobile, password=password)
        print(user)
        if user:
            login(request, user)
            reservations = Reservations.objects.filter(name=user)
            res_serializer  = ReservationsSerializer(reservations, context={'request': request}, many=True)
            context = {
                'isAuthenticated': user.is_authenticated,
                'id':user.id,
                'fullname':user.fullname,
                'mobile':user.mobile,
                'email':user.email,
                'reservations': res_serializer.data,
            }
            print(context)
            return Response({"status":'success', 'data':context})
        else:
            return Response({'status':'Error authenticating ... '})
        
#@method_decorator(csrf_protect, name='dispatch')
class LogoutView(APIView):

    def post(self, request):

        try:
            logout(request)
            return Response({"success": 'Logged out ... '})
        except:
            return Response({"error": 'Something went wrong when logging out ... '})

#@method_decorator(csrf_protect, name='dispatch')
class SignUpView(APIView):

    #permission_classes = (permissions.AllowAny, )

    def post(self,request):

        data = self.request.data

        print(data)

        mobile = data['mobile']
        fullname = data['fullname']
        email = data['email']
        password = data['password']


        if RestaurantUser.objects.filter(mobile=mobile).exists():
            return Response({"Error": "Mobile No alredy exists ... "})
        else:
            user = RestaurantUser.objects.create_user(mobile=mobile, password=password)
            user = RestaurantUser.objects.get(mobile=mobile)
            user.email = email
            user.fullname = fullname
            user.save(update_fields=["email",'fullname']) 

            return Response({'success':'User successfully created...'})
        return Response({"error":'Something went wrong'})

class GetCSRFToken(APIView):

    permission_classes = (permissions.AllowAny, )
    
    @method_decorator(ensure_csrf_cookie, name='dispatch')
    def get(self, request):
        print(self.request.META['CSRF_COOKIE'])
        return Response({'success': 'CSRF Cookie set...'})
    

#@method_decorator(csrf_protect, name='dispatch')   
class ReserveTableView(APIView):
    def post(self, request):

        data = self.request.data

        mobile = data['mobile']
        date = data["date"]
        slot = data['slot']
        guests = data["guests"]
        location_id = data["location_id"]
        token = data['token']

        print(data)
        from datetime import datetime

        time_str = slot
        time_object = datetime.strptime(time_str, '%H:%Mpm').time()
        print(type(time_object))
        print(time_object)

        reqDict = {
            "date": date,
            "slot": time_object,
            "guests": guests,
            "reservation_token" :token
            }

        ru = RestaurantUser.objects.get(mobile=mobile)
        print(ru)
        location = Locations(pk=location_id)
        new_reservation = Reservations(name=ru,location=location,**reqDict)
        print(new_reservation)
        new_reservation.save()

        print(new_reservation)
        reservations = Reservations.objects.filter(name=ru)
        print(reservations)
        res_serializer  = ReservationsSerializer(reservations, context={'request': request}, many=True)


        print(res_serializer.data)


  
        context = {
            'reservations': res_serializer.data,
        }
            
        return Response({'status':'success', 'data':context})
        return Response({'Error':'Something went wrong...'})
    


#@method_decorator(csrf_protect, name='dispatch')
class StaffLoginView(APIView):

    #permission_classes = (permissions.AllowAny, )
    def post(self, request):
        data = self.request.data

        mobile = data['mobile']
        password = data['password']

        user = MobileBackend().authenticate(request, mobile=mobile, password=password)
        print(user)
        if user and user.is_staff:
            
            login(request, user)

            return Response({"status":'success', 'data':context})
        else:
            return Response({'status':'Error authenticating ... '})




    

#@method_decorator(csrf_protect, name='dispatch')
class LocationsViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all()
    serializer_class = LocationsSerializer

'''



# Create your views here.

class RestaurantUserViewSet(viewsets.ModelViewSet):
    queryset = RestaurantUser.objects.all()
    serializer_class = RestaurantUserSerializer

    def create(self,request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.data['username']
            mobile = serializer.data['mobile']
            email = serializer.data['email']
            password = serializer.data['password']
            modelinstance = RestaurantUser(username=username, mobile=mobile, email=email,password=make_password(password))
            modelinstance.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class LocationsViewSet(viewsets.ModelViewSet):
    queryset = Locations.objects.all()
    serializer_class = LocationsSerializer
    


class CustomAuthToken(ObtainAuthToken):

    serializer_class = LoginSerializer
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = RestaurantUser.objects.get(mobile=serializer.data['mobile'])
            if (user.check_password(serializer.data["password"])):
                #user = authenticate(username=username, password=serializer.data['password'])
                token, created = Token.objects.get_or_create(user=user)
                #user = RestaurantUser.objects.filter(username = user).values()[0]
                #rersevations = Reservations.objects.filter(name = user["id"]).values()
                #print(rersevations)
                #contextdata = {
                #    "username": user["username"], 
                #    "reservations" : rersevations,
                #}
                return Response({'token': [token.key]}, status=status.HTTP_201_CREATED )
            return Response({'Message': 'Invalid Password'}, status=401)


class ReservationsViewSet(viewsets.ModelViewSet):
    queryset = Reservations.objects.all()
    serializer_class = ReservationsSerializer
    #permission_classes = [IsAuthenticated]
            



'''