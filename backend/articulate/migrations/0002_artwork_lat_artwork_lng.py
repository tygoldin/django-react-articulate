# Generated by Django 4.0.2 on 2022-02-17 20:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('articulate', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='artwork',
            name='lat',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='artwork',
            name='lng',
            field=models.FloatField(default=0),
        ),
    ]
