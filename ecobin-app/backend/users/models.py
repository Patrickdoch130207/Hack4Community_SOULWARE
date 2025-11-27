from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class CustomUser(AbstractUser):
    username = None
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, null=True, blank=True)
    code_expiry = models.DateTimeField(null=True, blank=True)    

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom']  

    def __str__(self):
        return self.email
    

  

    