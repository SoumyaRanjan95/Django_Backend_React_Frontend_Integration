from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User


class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = '__all__'


class RestaurantUserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields= ['mobile','email','fullname','password']
        #read_only_fields = ['mobile']

class RestaurantUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields= '__all__'
        read_only_fields = ['mobile']


    '''
        For some reasons the create and update methods in the serializer class doesnt hash the password to we use the make_password method in the view itself

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        instance.mobile = validated_data.get('mobile', instance.mobile)
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.set_password(instance.password)
        instance.save()
        return instance
    '''



class ReservationsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reservations
        fields = ['user','reservation_token','slot','guests','reservation_at',"date"]
        read_only_fields = ['user'] #doesnot show in the form in browsable api

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ['mobile',"password"]

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ['mobile','fullname','email','password']

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['name','type','veg_or_nonveg','price','info','serving_restaurant','available']

class OrdersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Orders
        fields=['order_datetime','from_restaurant','item','item_type','veg_or_nonveg','quantity','item_price_from_restaurant','user']

class ItemsSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemsOrdered
        fields=['']



















