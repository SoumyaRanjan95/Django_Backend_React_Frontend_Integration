# Generated by Django 5.1.3 on 2024-11-27 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurantapp', '0003_remove_itemsordered_item_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemsordered',
            name='item_cancelled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='itemsordered',
            name='quantity',
            field=models.PositiveIntegerField(default=1),
        ),
    ]
