# Generated by Django 4.0.2 on 2022-02-03 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Artwork',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=100)),
                ('born_died', models.CharField(max_length=100)),
                ('title', models.CharField(max_length=100)),
                ('date', models.CharField(max_length=40)),
                ('technique', models.CharField(max_length=100)),
                ('location', models.CharField(max_length=100)),
                ('url', models.CharField(max_length=100)),
                ('form', models.CharField(max_length=30)),
                ('type', models.CharField(max_length=30)),
                ('school', models.CharField(max_length=30)),
                ('timeframe', models.CharField(max_length=30)),
            ],
        ),
    ]
