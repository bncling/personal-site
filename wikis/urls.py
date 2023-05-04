from django.urls import path
from .views import WikiListView
from . import views

urlpatterns = [
	path("", views.homepage, name = "homepage"),
	path("about/", views.about, name = "about"),
	path("birds/", views.birds, name = "birds"),
	path("wiki", views.WikiListView.as_view(), name = "wiki")
]