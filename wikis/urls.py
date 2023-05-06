from django.urls import path
from .views import (
	WikiListView,
	WikiDetailView
)
from . import views

urlpatterns = [
	path("", views.homepage, name = "homepage"),
	path("about/", views.about, name = "about"),
	path("birds/", views.birds, name = "birds"),
	path("wiki/", views.WikiListView.as_view(), name = "wiki"),
	path("wiki/<int:pk>/", views.WikiDetailView.as_view(), name = "wiki-detail")
]