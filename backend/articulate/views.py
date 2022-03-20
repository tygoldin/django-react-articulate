from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ArtworkSerializer
from .models import Artwork
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
import csv
import pandas as pd
# Create your views here.


class ArtworkView(viewsets.ModelViewSet):
    serializer_class = ArtworkSerializer
    queryset = Artwork.objects.all()


@api_view(['GET', 'POST'])
def location_list(request):
    if request.method == 'GET':
        artworks_loc = Artwork.objects.values('location', 'lat', 'lng').distinct()
        df = pd.DataFrame(list(artworks_loc))
        return Response(df.to_dict('records'))


@api_view(['GET', 'POST'])
def artwork_list(request):
    if request.method == 'GET':
        location = request.GET.get('location', '')
        artworks = Artwork.objects.filter(location=location).values()
        print(artworks)
        df = pd.DataFrame(list(artworks))
        # print(df)
        return Response(df.to_dict('records'))
        # return Response(None)

@api_view(['GET', 'POST'])
def insert_artworks(request):
    if request.method == 'GET':
        with open('catalog_coords.csv') as f:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                _, created = Artwork.objects.get_or_create(
                    author=row[0],
                    born_died=row[1],
                    title=row[2],
                    date=row[3],
                    technique=row[4],
                    location=row[5],
                    url=row[6],
                    form=row[7],
                    type=row[8],
                    school=row[9],
                    timeframe=row[10],
                    lat=row[11],
                    lng=row[12]

                )
        return Response(None)