from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import *
from django.contrib.auth.models import User
from datetime import datetime, date


class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = '__all__'


class RestaurantUserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields= ['mobile','email','fullname','password']
        #read_only_fields = ['mobile']

        # These fields are displayed but not editable and have to be a part of 'fields' tuple
        # read_only_fields = 

        # These fields are only editable (not displayed) and have to be a part of 'fields' tuple
        extra_kwargs = {'password': {'write_only': True}}

class RestaurantUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields= ['mobile', 'fullname']


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

    '''def get_full_description(self, obj):
        #combines name and description fields
        return f"{obj.user} - {obj.date}"'''

    class Meta:
        model = Reservations
        fields = ['user','reservation_token','slot','guests','reservation_at',"date"]
        read_only_fields = ['user'] #doesnot show in the form in browsable api

    '''
    there is also a method called to internal value 
    '''

    def to_representation(self,instance): 
        representation = super().to_representation(instance)
        d = date.fromisoformat(representation.pop('date'))
        

        representation['date'] = d.strftime("%A, %d %B, %Y")
        representation['reservation_at'] = Restaurant.objects.get(id=representation.pop('reservation_at')).restaurant

        return representation

class LoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = RestaurantUser
        fields = ['mobile',"password"]

class RestaurantStaffSerializer(serializers.ModelSerializer):
    #restaurant = serializers.PrimaryKeyRelatedField()
    class Meta:
        model = RestaurantStaff
        fields = ['user','staff_of_restaurant']

    def to_representation(self,instance): 
        representation = super().to_representation(instance)
        

        representation['restaurant_id'] = representation['staff_of_restaurant']
        representation['restaurant_name'] = RestaurantStaff.objects.get(id=representation.pop('staff_of_restaurant')).restaurant

        return representation

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ['mobile','fullname','email','password']


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id','name','type','veg_or_nonveg','price','info','serving_restaurant','available']

class MenuListUpdateSerializer(serializers.ListSerializer):
    child = MenuSerializer()
    def update(self, instance, validated_data):
        for inst,data in zip(instance,validated_data):
            print(data,inst.available)
            inst.__dict__.update({'available':data['available']})
            inst.save()
            print('\n')
        return instance
        


class BulkCreateListSerializer(serializers.ListSerializer):

    def create(self, validated_data):
        items_ordered = validated_data['items_ordered']
        result = [ItemsOrdered(**item) for item in items_ordered]

        try:
            return ItemsOrdered.objects.bulk_create(result)
        except IntegrityError as e:
            raise ValidationError
        
class ItemsOrderedSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemsOrdered
        fields=['order_id','from_restaurant','menu_id','quantity','item_cancelled','user']
        #list_serializer_class = BulkCreateListSerializer

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['menu'] = Menu.objects.get(id=representation['menu_id']).name
        representation['price'] = Menu.objects.get(id=representation['menu_id']).price
        representation['gross_price'] = representation['price']*representation['quantity']

        return representation
 

class OrdersSerializer(serializers.ModelSerializer):

    """ In order to display the list of items here we take the related name from teh ItemsOrdered model.
        Then in the field if the related name is shown then it will show us the foreign key,
        but if we also write a variable with the same related name and give it a Serializer it will serialize the relationship
    """
    items_ordered = ItemsOrderedSerializer(many=True)


    class Meta:
        model = Orders
        fields=['order_id','order_datetime','from_restaurant','reservation_token','table_no','processed','user','items_ordered']
        #read_only_fields = ['user','processed']

    def to_representation(self, instance):
            representation = super().to_representation(instance)
            representation['restaurant_name'] = Restaurant.objects.get(id=representation['from_restaurant']).restaurant
            representation['username'] = RestaurantUser.objects.get(id=representation['user']).fullname
            representation['mobile'] = RestaurantUser.objects.get(id=representation['user']).mobile
            return representation

# ---------------------------------------------------------------------------------------------------------------------------------
class ItemsOrderedPOSTSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemsOrdered
        fields=['from_restaurant','menu_id','quantity','item_cancelled']
        #list_serializer_class = BulkCreateListSerializer

class OrdersPOSTSerializer(serializers.ModelSerializer):

    """ In order to display the list of items here we take the related name from teh ItemsOrdered model.
        Then in the field if the related name is shown then it will show us the foreign key,
        but if we also write a variable with the same related name and give it a Serializer it will serialize the relationship
    """
    items_ordered = ItemsOrderedPOSTSerializer(many=True)

    def create(self,validated_data):
        #items_ordered = self.context.get('request').data.pop('items_ordered')
        items_ordered = validated_data.pop('items_ordered')
        #print(validated_data)
        #print(items_ordered)
        return Orders.new_objects.create_with_items_ordered(validated_data, items_ordered)


    class Meta:
        model = Orders
        fields=['from_restaurant','reservation_token','table_no','processed','items_ordered']
        #read_only_fields = ['user','processed']
#----------------------------------------------------------------------------------------------------------------------------------


'''class OrdersListSerializer(serializers.HyperlinkedModelSerializer):
    click_to_process = serializers.HyperlinkedIdentityField(view_name='process_orders_detail')
    class Meta:
        model = Orders
        fields=['order_id','order_datetime','from_restaurant','reservation_token','table_no','processed','user','click_to_process']
        read_only_fields = ['user']'''





class BillsSerializer(serializers.ModelSerializer):

    
    def to_representation(self,instance):
        representation = super().to_representation(instance)
        order = Orders.objects.get(order_id = representation['order_id'])
        representation['user'] = order.user.fullname
        representation['mobile'] = order.user.mobile

        return representation

    class Meta:
        model = Bills
        #fields =['order_id']
        fields =['order_id','reservation_token','processed','from_restaurant','user']
        #read_only_fields = ['from_restaurant','user']


















