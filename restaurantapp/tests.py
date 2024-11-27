from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
import json
from .models import *

# Create your tests here.


def project():
    order = Orders.objects.get(order_id='84754777-d1c3-4dba-be52-2298f862a3b1')
    return ItemsOrdered.objects.create(order_id = order.order_id, quantity=2)

class UsersManagerTests(TestCase):

    '''def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(mobile="1234567890", password="foo")
        self.assertEqual(user.mobile, "1234567890")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(user.username)
        except AttributeError:
            pass
        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(mobile="")
        with self.assertRaises(ValueError):
            User.objects.create_user(mobile="", password="foo")

    def test_create_superuser(self):
        User = get_user_model()
        admin_user = User.objects.create_superuser(mobile="1111111111", password="foo")
        self.assertEqual(admin_user.mobile, "1111111111")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        try:
            # username is None for the AbstractUser option
            # username does not exist for the AbstractBaseUser option
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                mobile="1111111111", password="foo", is_superuser=False)'''
            


    def test_submit_orders(self):

        TEST_CASE = 10000
        data =  {
        "order_id": "a08270df-08bc-46c9-b6be-439fc2b4a4f6",
        "order_datetime": "2024-11-27T14:02:27.459200Z",
        "from_restaurant": 3,
        "reservation_token": "aae3e9d7-584d-4467-95dc-7f15a6242cd5",
        "table_no": "191",
        "processed": 'false',
        "user": 28,
        "items_ordered": [
            {
                "order_id": "a08270df-08bc-46c9-b6be-439fc2b4a4f6",
                "from_restaurant": 3,
                "menu_id": 1,
                "quantity": 1,
                "item_cancelled": 'false',
                "user": 2
            },
            {
                "order_id": "a08270df-08bc-46c9-b6be-439fc2b4a4f6",
                "from_restaurant": 3,
                "menu_id": 2,
                "quantity": 1,
                "item_cancelled": 'false',
                "user": 28
            },
            {
                "order_id": "a08270df-08bc-46c9-b6be-439fc2b4a4f6",
                "from_restaurant": 3,
                "menu_id": 1,
                "quantity": 1,
                "item_cancelled": 'false',
                "user": 2
            },
            {
                "order_id": "a08270df-08bc-46c9-b6be-439fc2b4a4f6",
                "from_restaurant": 3,
                "menu_id": 1,
                "quantity": 1,
                "item_cancelled": 'false',
                "user": 2
            },
            {
                "order_id": "a08270df-08bc-46c9-b6be-439fc2b4a4f6",
                "from_restaurant": 3,
                "menu_id": 1,
                "quantity": 1,
                "item_cancelled": 'false',
                "user": 2
            }
        ]
        }
        factory = APIRequestFactory()
        for i in range(TEST_CASE):
            response = factory.post('/api/orders/',json.dumps(data), content_type='application/json')
