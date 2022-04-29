from rest_framework import serializers
<<<<<<< Updated upstream
from .models import Artwork
=======
from .models import Artwork, Interactions, userRecommendations
>>>>>>> Stashed changes


class ArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artwork
        fields = ('id', 'author', 'born_died', 'title', 'date', 'technique',
                  'location', 'url', 'form', 'type', 'school', 'timeframe', 'lat', 'lng',
                  'descriptions','keywords','color_0','color_1','color_2','color_3','color_4','color_5','cluster_id')
<<<<<<< Updated upstream
=======

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interactions
        fields = ('id', 'user', 'view_count', 'artwork', 'rating')


class RecommendationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = userRecommendations
        fields = ('id', 'recommendations', 'user')
>>>>>>> Stashed changes
