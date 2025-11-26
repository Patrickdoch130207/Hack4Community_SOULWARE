from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PointDeCollecte
from .serialyzer import PointDeCollecteSerializer
import math

class PointDeCollecteViewSet(viewsets.ModelViewSet):
    queryset = PointDeCollecte.objects.all()
    serializer_class = PointDeCollecteSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return PointDeCollecte.objects.filter(statut='ACTIF')

    def perform_create(self, serializer):
        serializer.save(statut='BROUILLON')

    @action(detail=False, methods=['get', 'post'])
    def plus_proche(self, request):
        # Récupérer les coordonnées de l'utilisateur
        lat = request.query_params.get("lat") or request.data.get("lat")
        lon = request.query_params.get("lon") or request.data.get("lon")

        try:
            user_lat = float(lat)
            user_lon = float(lon)
        except (TypeError, ValueError):
            return Response({"error": "Coordonnées requises"}, status=400)

        # Fonction de calcul de distance (Haversine)
        def distance(lat1, lon1, lat2, lon2):
            R = 6371  # Rayon de la Terre en km
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            return R * c

        # Récupérer tous les points
        points = PointDeCollecte.objects.all()
        if not points.exists():
            return Response({"error": "Aucun point de collecte disponible"}, status=404)

        # Trouver le point le plus proche
        point_proche = min(
            points,
            key=lambda p: distance(user_lat, user_lon, float(p.latitude), float(p.longitude))
        )

        serializer = self.get_serializer(point_proche)
        return Response(serializer.data)



""" from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import PointDeCollecte
from .serialyzer import PointDeCollecteSerializer
import math
from rest_framework.response import Response
from rest_framework.decorators import action

class PointDeCollecteViewSet(viewsets.ModelViewSet):
    #Avec Viewset GET permet la lectUre des  points de collectes exixtants
    # POST assure le signalement d'uun nouveau point
    queryset = PointDeCollecte.objects.all()
    serializer_class = PointDeCollecteSerializer
    #Autoriser tout le monde à lire et créer des points de collectes
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        #Affiche tout les points de collectes disponibles
        return PointDeCollecte.objects.filter(statut='ACTIF')
    def perform_create(self, serializer):
        #Quand l'utilisateur fait un Post, on le sauvegarde comme brouillon en attendant que l'admin confirme 
        serializer.save(statut='BROUILLON')
    @action(detail=False, methods=['get', 'post'])
    def plus_proche(self, request):
        #montre à l'utilisateur le pont le plus proche de lui 
        #recupérer les coordonnées de l'utilisateur par Query ou JSON 
        lat = request.query_params.get("lat") or request.data.get("lat")
        lon = request.query_params.get("lon") or request.data.get("lon")

        try:
            user_lat = float(lat)
            user_lon = float(lon)
        except(TypeError, ValueError):
            return Response({"error": "Coordonnées requises"}, status = 400)

    def distance(lat1, lon1, lat2, lon2):
        # Formule de Haversine (distance en km)
        R = 6371  # Rayon de la Terre en km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    points = PointDeCollecte.objects.all()
    if not points.exists():
        return Response({"error": "Aucun point de collecte disponible"}, status=404)

    # Trouver le point le plus proche
    point_proche = min(
        points,
        key=lambda p: distance(user_lat, user_lon, float(p.latitude), float(p.longitude))
    )

    serializer = self.get_serializer(point_proche)
    return Response(serializer.data) """

# Create your views here.
