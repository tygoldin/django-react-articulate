from django.contrib import admin
from .models import Artwork


class ArtworkAdmin(admin.ModelAdmin):
    list_display = ('author', 'born_died', 'title', 'date', 'technique',
                    'location', 'url', 'form', 'type', 'school', 'timeframe')

# Register your models here.


admin.site.register(Artwork, ArtworkAdmin)
