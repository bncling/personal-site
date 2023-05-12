from django.urls import path, re_path
from .views import (
	WikiListView,
	WikiDetailView,
	PostListView,
	PostDetailView
)
from . import views

urlpatterns = [
	path("", views.homepage, name = "homepage"),
	path("about/", views.about, name = "about"),
	path("birds/", views.birds, name = "birds"),
	path("wiki/", views.WikiListView.as_view(), name = "wiki"),
	path("wiki/<slug:slug>/", views.WikiDetailView.as_view(), name = "wiki-detail"),
	path("posts/", views.PostListView.as_view(), name = "posts"),
	path("posts/<slug:slug>/", views.PostDetailView.as_view(), name = "post-detail"),
	path("problems_and_solutions/", views.TextbookListView.as_view(), name = "problems"),
	path("secret/", views.secret, name = "secret")
]