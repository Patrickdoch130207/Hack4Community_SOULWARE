# api/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path(
        'predict/image/', 
        views.predict_image, 
        name='identify-waste' # Nom de l'URL pour une référence interne facile
    ),
    
]