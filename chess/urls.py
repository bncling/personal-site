from django.urls import path
from . import views

urlpatterns = [
	path("", views.chess, name = "chess-home"),
	path("white_repertoire_training/", views.white_rep_training, name = "white-practice"),
	path("black_repertoire_training/", views.black_rep_training, name = "black-practice"),
	path("white_repertoire_editing/", views.white_rep_editing, name = "white-editing"),
	path("black_repertoire_editing/", views.black_rep_editing, name = "black-editing"),
	path("save_rep/", views.save_rep, name = "save-rep"),
	path("guess_variations/", views.guess_vars, name = "guess-variations")
]