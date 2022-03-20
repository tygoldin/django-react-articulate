from django.db import models

# Create your models here.


class Artwork(models.Model):
    author = models.CharField(max_length=100)
    born_died = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    date = models.CharField(max_length=40)
    technique = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    url = models.CharField(max_length=100)
    form = models.CharField(max_length=30)
    type = models.CharField(max_length=30)
    school = models.CharField(max_length=30)
    timeframe = models.CharField(max_length=30)
    lat = models.FloatField(default=0)
    lng = models.FloatField(default=0)

    def _str_(self):
        return self.title
