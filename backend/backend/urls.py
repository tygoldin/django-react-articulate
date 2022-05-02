"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from articulate import views

router = routers.DefaultRouter()
router.register(r'artworks', views.ArtworkView, 'artwork')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/location_list/', views.location_list),
    # path('api/insert_artworks/', views.insert_artworks),
    # path('api/insert_artworks_desc_colors/', views.insert_artworks_desc_colors),
    path('api/artwork_list/', views.artwork_list),
    path('api/get_recommendations/', views.get_recommendations),
    path('api/get_color_palette/', views.get_color_palette),
    path('api/test_route/', views.test_route),
    path('api/get_random_artwork/', views.get_random_artwork),
    path('api/get_random_artworks/', views.get_random_artworks),
    path('api/get_random_artworks_time_period/', views.get_random_artworks_time_period),
    path('api/get_filtered_artworks_by_timeframe/', views.get_filtered_artworks_by_timeframe),
    path('api/get_filtered_artworks_for_timeframe/', views.get_filtered_artworks_for_timeframe),
    path('api/get_user_interactions/', views.get_user_interactions),
    path('api/populate_users/',views.populate_users),
    path('api/populate_interactions/',views.populate_interactions),
    path('api/update_views/',views.update_views),
    path('api/update_rating/',views.update_rating),
    path('api/update_user_recommendations/',views.update_user_recommendations),
    path('api/get_user_recommendations/', views.get_user_recommendations),
    path('api/get_user_recommendations_time_period/', views.get_user_recommendations_time_period),
    path('api/get_rating/', views.get_rating),
    path('api/login_user/', views.login_user),
    path('api/logout_user/', views.logout_user),
    path('api/check_auth/', views.check_auth),
    path('api/get_total_interactions/', views.get_total_interactions),
    path('api/get_interacted_artworks/', views.get_interacted_artworks),
    path('api/get_interacted_artworks_by_field/', views.get_interacted_artworks_by_field),
    path('api/get_overall_trends/', views.get_overall_trends)
]
