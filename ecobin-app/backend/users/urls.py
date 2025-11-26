from django.urls import path
from .views import register_user
from .views import login
from .views import home
from .views import chatbot

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login, name='login'),
    path('home/',home, name='home'),
    path('chatbot/',chatbot, name='chatbot'),
]
