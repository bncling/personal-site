from django.urls import path
from . import views

urlpatterns = [
	path("", views.chess, name = "chess-home")
]