from rest_framework import serializers
from django.core.exceptions import ValidationError
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

class RestaurantStaffSerializer(serializers.ModelSerializer):
    #restaurant = serializers.PrimaryKeyRelatedField()
    class Meta:
        model = RestaurantStaff
        fields = ['user','staff_of_restaurant']

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantUser
        fields = ['mobile','fullname','email','password']

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id','name','type','veg_or_nonveg','price','info','serving_restaurant','available']
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

class OrdersSerializer(serializers.ModelSerializer):

    """ In order to display the list of items here we take the related name from teh ItemsOrdered model.
        Then in the field if the related name is shown then it will show us the foreign key,
        but if we also write a variable with the same related name and give it a Serializer it will serialize the relationship
    """
    items_ordered = ItemsOrderedSerializer(many=True,read_only=True)

    def create(self,validated_data):
        items_ordered = self.context.get('request').data['items_ordered']
        print(self.context.get('request').data['items_ordered'])
        return Orders.new_objects.create_with_items_ordered(validated_data, items_ordered)


    class Meta:
        model = Orders
        fields=['order_id','order_datetime','from_restaurant','reservation_token','table_no','processed','user','items_ordered']
        #read_only_fields = ['user','processed']

'''class OrdersListSerializer(serializers.HyperlinkedModelSerializer):
    click_to_process = serializers.HyperlinkedIdentityField(view_name='process_orders_detail')
    class Meta:
        model = Orders
        fields=['order_id','order_datetime','from_restaurant','reservation_token','table_no','processed','user','click_to_process']
        read_only_fields = ['user']'''





class BillsSerializer(serializers.ModelSerializer):

    '''def create(self,validated_data):
        reservation_token = validated_data.pop('reservation_token')
        processed= validated_data.pop('processed')
        order = Orders.objects.get(reservation_token=reservation_token)
        from_restaurant = order.from_restaurant
        user = order.user
        bill = Bills(order_id=order,from_restaurant=from_restaurant,user=user,reservation_token=reservation_token,processed=processed)
        return bill'''

    class Meta:
        model = Bills
        fields =['order_id','reservation_token','processed','from_restaurant','user']
        read_only_fields = ['from_restaurant','user']


















