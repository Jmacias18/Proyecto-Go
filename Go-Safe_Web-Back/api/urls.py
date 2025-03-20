from django.urls import path
from .views import login, create_conductor    

urlpatterns = [
    path('auth/login', login, name='login'),
    path('auth/create_conductor', create_conductor, name='create_conductor'),
]