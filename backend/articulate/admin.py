from django.contrib import admin
from .models import Artwork, Interactions, userRecommendations


class ArtworkAdmin(admin.ModelAdmin):
    list_display = ('author', 'born_died', 'title', 'date', 'technique',
                    'location', 'url', 'form', 'type', 'school', 'timeframe', 'lat', 'lng')

class InteractionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'view_count', 'artwork', 'rating')

class userRecommendationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'recommendations', 'user')

# Register your models here.


admin.site.register(Artwork, ArtworkAdmin)
admin.site.register(Interactions, InteractionsAdmin)
admin.site.register(userRecommendations, userRecommendationsAdmin)
