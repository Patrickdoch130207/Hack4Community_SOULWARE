from rest_framework.routers import DefaultRouter
from .views import PointDeCollecteViewSet

from django.urls import path

urlpatterns = [
    path('points-de-collecte/', PointDeCollecteViewSet.as_view({'get': 'list', 'post': 'create'}), name='points_de_collecte'),
    path('points-de-collecte/plus_proche/', PointDeCollecteViewSet.as_view({'get': 'plus_proche', 'post': 'plus_proche'}), name='point_de_collecte_plus_proche'),
]
