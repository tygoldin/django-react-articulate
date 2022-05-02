from django.db import models
from django.conf import settings
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

class Interactions(models.Model):
    user = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
    )
    view_count = models.IntegerField(default=0)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    rating = models.IntegerField(default=0)

    class Meta:
        db_table = "interactions"
    def _str_(self):
        return self.title

class userRecommendations(models.Model):
    recommendations = models.CharField(max_length=10000)
    user = models.ForeignKey(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
    )

    class Meta:
        db_table = "user_recommendations"
    def _str_(self):
        return self.title


class Top100ArtworksByViews(models.Model):
    artwork_id = models.BigIntegerField()
    views = models.DecimalField(max_digits=32, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '01_top100_artworks_by_views'


class Top100ArtworksByRatings(models.Model):
    artwork_id = models.BigIntegerField()
    avg_rating = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '02_top100_artworks_by_ratings'


class TopCategoriesForm(models.Model):
    form = models.TextField(blank=True, null=True)
    popularity = models.DecimalField(max_digits=36, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '03_top_categories_form'


class TopCategoriesType(models.Model):
    type = models.TextField(blank=True, null=True)
    popularity = models.DecimalField(max_digits=36, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '04_top_categories_type'


class Top100ArtistsByViews(models.Model):
    artist = models.TextField(blank=True, null=True)
    views = models.DecimalField(max_digits=32, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '05_top100_artists_by_views'


class TopTimeframesByViews(models.Model):
    timeframe = models.TextField(blank=True, null=True)
    popularity = models.DecimalField(max_digits=36, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '06_top_timeframes_by_views'


class TopCategoriesByRatingsForm(models.Model):
    form = models.TextField(blank=True, null=True)
    avg_rating = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '07_top_categories_by_ratings_form'


class TopCategoriesByRatingsType(models.Model):
    type = models.TextField(blank=True, null=True)
    avg_rating = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '08_top_categories_by_ratings_type'


class Top100LocationsByRatings(models.Model):
    location = models.TextField(blank=True, null=True)
    avg_rating = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '09_top100_locations_by_ratings'


class Top100LocationsByViews(models.Model):
    location = models.TextField(blank=True, null=True)
    views = models.DecimalField(max_digits=32, decimal_places=0, blank=True, null=True)

    class Meta:
        managed = False
        db_table = '10_top100_locations_by_views'