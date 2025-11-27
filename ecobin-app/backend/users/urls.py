from django.urls import path
from .views import register_user
from .views import login
from .views import home
from .views import chatbot
from .views import verify_code
from .views import password_reset_request, password_reset_confirm


urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login, name='login'),
    path('home/',home, name='home'),
    path('chatbot/',chatbot, name='chatbot'),
    path('verify_email/', verify_code, name='verify_email'),
    path('password-reset/', password_reset_request, name='password_reset_request'),
    path('password-reset-confirm/', password_reset_confirm, name='password_reset_confirm'),    
]
