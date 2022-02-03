from rest_framework import serializers
from .models import Artwork


class ArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artwork
        fields = ('id', 'author', 'born_died', 'title', 'date', 'technique',
                  'location', 'url', 'form', 'type', 'school', 'timeframe')
