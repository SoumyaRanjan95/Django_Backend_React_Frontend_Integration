from rest_framework import serializers
from .models import RestaurantUser, Reservations, Locations
from django.contrib.auth.models import User


class LocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Locations
        fields = ['id',"restaurant","city"]

class LocationsSerializerCombined(serializers.ModelSerializer):
    class Meta:
        model = Locations
        fields = ["restaurant","city"]

    def to_representation(self, value):
        return f'{value.restaurant}, {value.city}'


class RestaurantUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ["mobile","email","password"]
        #fields ="__all__"

class RestaurantUserSerializerMobilenameOnly(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ["mobile"]

    def to_representation(self, value):
        return f'{value.mobile}'


class ReservationsSerializer(serializers.ModelSerializer):

    def __init__(self,*args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.context['request'].method == 'POST':   # change this to post 'POST'
            self.fields['name'] = RestaurantUserSerializerMobilenameOnly()
            self.fields['location'] = LocationsSerializerCombined()

    class Meta:
        model = Reservations
        fields = ["date","guests","name","location",'slot']

    '''def to_representation(self, value):

        value["name"] = RestaurantUser.objects.get(value.name).username
        value['locations'] = f'{Locations.objects.get(value.location).restaurant}  {Locations.objects.get(value.location).restaurant}'

        return value'''


    




class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ["mobile","password"]



