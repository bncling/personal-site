from django.shortcuts import render
from django.views.generic import (
	ListView,
	DetailView,
)
from .models import Wiki, Post

# Create your views here.
def homepage(request):
	return render(request, "wikis/home.html")


def about(request):
	return render(request, "wikis/about.html", {"title": "About"})


def birds(request):
	return render(request, "wikis/birdMap.html", {"title": "Birds"})


class WikiListView(ListView):
	model = Wiki
	template_name = "wikis/wiki.html"
	context_object_name = "wikis"
	ordering = ["-date_posted"]

	def get_context_data(self, *args, **kwargs):
		context = super(WikiListView, self).get_context_data(*args, **kwargs)
		context['title'] = "Math Wiki"
		return context


class WikiDetailView(DetailView):
	model = Wiki


class PostListView(ListView):
	model = Post
	template_name = "wikis/posts.html"
	context_object_name = "posts"
	ordering = ["-date_posted"]

	def get_context_data(self, *args, **kwargs):
		context = super(PostListView, self).get_context_data(*args, **kwargs)
		context['title'] = "Math Posts"
		return context


class PostDetailView(DetailView):
	model = Post