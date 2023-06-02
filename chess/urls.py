from django.urls import path
from . import views

urlpatterns = [
	path("", views.chess, name = "chess-home"),
	path("white_repertoire_training/", views.white_rep_training, name = "white-practice"),
	path("black_repertoire_training/", views.black_rep_training, name = "black-practice")
]