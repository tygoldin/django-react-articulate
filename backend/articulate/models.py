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
    descriptions = models.CharField(max_length=10000)
    keywords = models.CharField(max_length=200)
    color_0 = models.CharField(max_length=40)
    color_1 = models.CharField(max_length=40)
    color_2 = models.CharField(max_length=40)
    color_3 = models.CharField(max_length=40)
    color_4 = models.CharField(max_length=40)
    color_5 = models.CharField(max_length=40)
    cluster_id = models.IntegerField(default=0)

    class Meta: 
        db_table = "artwork"

    def _str_(self):
        return self.title
