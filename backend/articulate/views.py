from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ArtworkSerializer
from .models import Artwork
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
import csv
import pandas as pd
import random
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

@api_view(['GET', 'POST'])
def insert_artworks_desc_colors(request):
    if request.method == 'GET':
        Artwork.objects.all().delete()
        with open('catalog_coord_keyword_color.csv', encoding='latin1') as f:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                #Handling NA values in lat-long
                if row[11] == '#N/A':
                    row[11] = 0
                if row[12] == '#N/A':
                    row[12] = 0

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
                    lng=row[12],
                    descriptions=row[13],
                    keywords=row[14],
                    color_0=row[15],
                    color_1=row[16],
                    color_2=row[17],
                    color_3=row[18],
                    color_4=row[19],
                    color_5=row[20],
                    cluster_id=row[21]

                )
        return Response(None)

@api_view(['GET', 'POST'])
def test_route(request):
    if request.method == 'GET':
        art1 = Artwork.objects.filter(id=174331).values()
        return Response(art1)


@api_view(['GET', 'POST'])
def get_recommendations(request):
    if request.method == 'GET':
        artwork_id = request.GET.get('artwork_id', '')
        current_art = Artwork.objects.filter(id=artwork_id).values()[0]
        current_cluster = current_art['cluster_id']
        
        cluster_artworks = Artwork.objects.filter(cluster_id=current_cluster).values()
        recos = random.sample(list(cluster_artworks),10)
        return Response([art['id'] for art in recos])


@api_view(['GET', 'POST'])
def get_color_palette(request):
    if request.method == 'GET':
        artwork_id = request.GET.get('artwork_id', '')
        current_art = Artwork.objects.filter(id=artwork_id).values()[0]
        return Response({key: value for key, value in current_art.items() if key.startswith('color')})
