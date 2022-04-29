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
<<<<<<< Updated upstream
=======
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from faker import Faker
import numpy as np
>>>>>>> Stashed changes
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
        art1 = Artwork.objects.filter(cluster_id=274).values()
        return Response(len(art1))


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
<<<<<<< Updated upstream
=======

@api_view(['GET', 'POST'])
def get_random_artwork(request):
    if request.method == 'GET':
        items = list(Artwork.objects.all())
        return Response(ArtworkSerializer(random.choice(items)).data)

@api_view(['GET', 'POST'])
def get_random_artworks(request):
    if request.method == 'GET':
        items = list(Artwork.objects.all().values())
        df = pd.DataFrame(random.sample(items, 100))
        return Response(df.to_dict('records'))

@api_view(['GET', 'POST'])
def get_random_artworks_time_period(request):
    if request.method == 'GET':
        timeframe = request.GET.get('timeframe', '')
        items = list(Artwork.objects.filter(timeframe=timeframe).values())
        if len(items) < 100:
            df = pd.DataFrame(random.sample(items, len(items) - 1))
        else:
            df = pd.DataFrame(random.sample(items, 100))
        return Response(df.to_dict('records'))

@api_view(['GET', 'POST'])
def get_filtered_artworks_by_timeframe(request):
    if request.method == 'GET':
        return Response(None)
    if request.method == 'POST':
        forms = request.data['forms']
        types = request.data['types']
        schools = request.data['schools']
        techniques = request.data['techniques']
        form_filter_query = Q()
        for form in forms:
            form_filter_query.add(Q(form=form), Q.OR)
        type_filter_query = Q()
        for type in types:
            type_filter_query.add(Q(type=type), Q.OR)
        school_filter_query = Q()
        for school in schools:
            school_filter_query.add(Q(school=school), Q.OR)
        technique_filter_query = Q()
        for technique in techniques:
            technique_filter_query.add(Q(technique__contains=technique), Q.OR)
        filter_query = Q()
        filter_query.add(form_filter_query, Q.AND)
        filter_query.add(type_filter_query, Q.AND)
        filter_query.add(school_filter_query, Q.AND)
        filter_query.add(technique_filter_query, Q.AND)
        items = list(Artwork.objects.filter(filter_query).values())
        df = pd.DataFrame(items)
        if df.empty:
            return Response({})
        df = df.groupby(['timeframe']).count()
        return Response(df.to_dict('index'))

@api_view(['GET', 'POST'])
def get_filtered_artworks_for_timeframe(request):
    if request.method == 'GET':
        return Response(None)
    if request.method == 'POST':
        forms = request.data['forms']
        types = request.data['types']
        schools = request.data['schools']
        techniques = request.data['techniques']
        timeframe = request.data['timeframe']
        form_filter_query = Q()
        for form in forms:
            form_filter_query.add(Q(form=form), Q.OR)
        type_filter_query = Q()
        for type in types:
            type_filter_query.add(Q(type=type), Q.OR)
        school_filter_query = Q()
        for school in schools:
            school_filter_query.add(Q(school=school), Q.OR)
        technique_filter_query = Q()
        for technique in techniques:
            technique_filter_query.add(Q(technique__contains=technique), Q.OR)
        filter_query = Q()
        filter_query.add(form_filter_query, Q.AND)
        filter_query.add(type_filter_query, Q.AND)
        filter_query.add(school_filter_query, Q.AND)
        filter_query.add(technique_filter_query, Q.AND)
        filter_query.add(Q(timeframe=timeframe), Q.AND)
        items = list(Artwork.objects.filter(filter_query)[:200].values())
        df = pd.DataFrame(items)
        print(df)
        return Response(df.to_dict('records'))

@api_view(['GET', 'POST'])
def get_user_interactions(request):
    if request.method == 'GET':
        current_user = request.user
        interactions = Interactions.objects.filter(user=current_user).values()
        return Response(interactions)


@api_view(['GET','POST'])
def populate_users(request):
    if request.method == 'GET':
        User.objects.filter(is_superuser=False).delete()
        fake = Faker()
        for i in range(1000):
            user = User.objects.create_user(username=fake.unique.numerify('user_########'),password='ARTiculate15')

    return Response(None)


# Populate Interactions directly

# @api_view(['GET','POST'])
# def populate_interactions(request):
#     if request.method == 'GET':

#         Interactions.objects.all().delete()
        
#         #Get all users
#         User = get_user_model()
#         users = list(User.objects.values())

#         #Get all artworks
#         artworks = list(Artwork.objects.all().values())

#         #Generate view count
#         views = np.random.lognormal(6,0.5, len(Artwork.objects.all()))
#         views = [np.rint(v) if np.random.binomial(1,0.1) == 0 else 0 for v in views]
#         # print(views)

#         #Populate data
#         #Assign arbitrary proportions of total views to a randomly chosen user (max views per post per user=20)
#         #Probability of user liking = (#views by user)/20
#         for i, v in enumerate(views):
#             temp = v
#             print(i)
#             art_id = artworks[i]['id']
#             #Order users randomly to assign views
#             users_temp = np.random.permutation(users)
#             while(temp > 0):
#                 count = np.random.randint(1,min(20,temp+1))
#                 if np.random.binomial(1,count/20) == 0:
#                     rating = 0
#                 else:
#                     rating = np.random.randint(1,6)
#                 _, created = Interactions.objects.get_or_create(
#                     view_count = count,
#                     rating = rating,
#                     artwork_id = art_id,
#                     user_id = users_temp[0]['id'])
#                 temp = temp - count
#                 # Remove user that is already populated
#                 users_temp = users_temp[1:]


#         return Response(None)


# Populate Interactions from csv

@api_view(['GET','POST'])
def populate_interactions(request):
    if request.method == 'GET':

        Interactions.objects.all().delete()
        i = 0
        with open('interactions_table.csv') as f:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                _, created = Interactions.objects.get_or_create(
                    view_count=row[0],
                    rating=row[1],
                    artwork_id=row[2],
                    user_id=row[3]
                )
                i = i+1
                print(i)
        return Response(None)


@api_view(['GET','POST'])
def update_views(request):
    if request.method == 'GET':
        current_user = request.user
        artwork_id = request.GET.get('artwork_id', '')
        current_art = Artwork.objects.filter(id=artwork_id).values()[0]

        interactions = Interactions.objects.filter(user=current_user,artwork=artwork_id).values()
        if len(interactions)>0:
            view_count = interactions[0]['view_count']
            obj, created = Interactions.objects.update_or_create(user=current_user, artwork=artwork_id,defaults={'view_count': view_count+1})
        else:
            obj, created = Interactions.objects.get_or_create(view_count = 1, rating = 0, user=current_user, artwork_id=artwork_id)
        
        interactions = Interactions.objects.filter(user=current_user,artwork=artwork_id).values()
        return Response(interactions)


@api_view(['GET','POST'])
def update_rating(request):
    if request.method == 'GET':
        current_user = request.user
        artwork_id = request.GET.get('artwork_id', '')
        rating = request.GET.get('rating', '')
        current_art = Artwork.objects.filter(id=artwork_id).values()[0]

        obj, created = Interactions.objects.update_or_create(user=current_user, artwork=artwork_id,defaults={'rating': rating})
        interactions = Interactions.objects.filter(user=current_user,artwork=artwork_id).values()
        return Response(interactions)
>>>>>>> Stashed changes
