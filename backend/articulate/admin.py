from django.contrib import admin
<<<<<<< Updated upstream
from .models import Artwork
=======
from .models import Artwork, Interactions, userRecommendations
>>>>>>> Stashed changes


class ArtworkAdmin(admin.ModelAdmin):
    list_display = ('author', 'born_died', 'title', 'date', 'technique',
                    'location', 'url', 'form', 'type', 'school', 'timeframe', 'lat', 'lng')

<<<<<<< Updated upstream
=======
class InteractionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'view_count', 'artwork', 'rating')

class userRecommendationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'recommendations', 'user')

>>>>>>> Stashed changes
# Register your models here.


admin.site.register(Artwork, ArtworkAdmin)
<<<<<<< Updated upstream
=======
admin.site.register(Interactions, InteractionsAdmin)
admin.site.register(userRecommendations, userRecommendationsAdmin)
>>>>>>> Stashed changes
