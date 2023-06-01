from django.urls import path, re_path, include
from .views import (
	WikiListView,
	WikiDetailView,
	WikiCreateView,
	WikiUpdateView,
	WikiDeleteView,
	PostListView,
	PostDetailView,
	PostCreateView,
	PostUpdateView,
	PostDeleteView
)
from . import views

urlpatterns = [
	path("", views.homepage, name = "homepage"),
	path("about/", views.about, name = "about"),
	path("birds/", views.birds, name = "birds"),
	path("wiki/", views.WikiListView.as_view(), name = "wiki"),
	path("wiki/<slug:slug>/", views.WikiDetailView.as_view(), name = "wiki-detail"),
	path("new_wiki", views.WikiCreateView.as_view(), name = 'wiki-create'),
	path("wiki/<slug:slug>/update/", views.WikiUpdateView.as_view(), name = "wiki-update"),
	path("wiki/<slug:slug>/delete/", views.WikiDeleteView.as_view(), name = "wiki-delete"),
	path("posts/", views.PostListView.as_view(), name = "posts"),
	path("posts/<slug:slug>/", views.PostDetailView.as_view(), name = "post-detail"),
	path("new_post", views.PostCreateView.as_view(), name = "post-create"),
	path("posts/<slug:slug>/update/", views.PostUpdateView.as_view(), name = "post-update"),
	path("posts/<slug:slug>/delete/", views.PostDeleteView.as_view(), name = "post-delete"),
	path("problems_and_solutions/", views.TextbookListView.as_view(), name = "problems"),
	path("secret/", views.secret, name = "secret"),
	path("chess/", include("chess.urls"))
]