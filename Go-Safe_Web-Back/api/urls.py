from django.urls import path
from .views import login_admin, login_conductor, create_conductor

urlpatterns = [
    path('auth/login/admin', login_admin, name='login_admin'),
    path('auth/login/conductor', login_conductor, name='login_conductor'),
]