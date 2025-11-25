from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nom', 'prenom', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # hash password
        return super().create(validated_data)
