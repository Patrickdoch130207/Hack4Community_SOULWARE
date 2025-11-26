from rest_framework import serializers
from .models import PointDeCollecte

class PointDeCollecteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointDeCollecte
        fields = '__all__' 