from django.db import models

class PointDeCollecte(models.Model):
    nom = models.CharField(max_length=100, verbose_name="Nom du point de collecte") 
    #definir les coordonnées geographiques 
    latitude = models.DecimalField(max_digits=9, decimal_places=6,verbose_name="Latitude")
    longitude = models.DecimalField(max_digits=9, decimal_places=6,verbose_name="longitude")

# Create your models here.
