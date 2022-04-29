# Generated by Django 4.0.2 on 2022-04-28 00:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('articulate', '0006_remove_interactions_liked_interactions_rating'),
    ]

    operations = [
        migrations.CreateModel(
            name='userRecommendations',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recommendations', models.CharField(max_length=10000)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_recommendations',
            },
        ),
    ]
