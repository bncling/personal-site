from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import (
	ListView,
	DetailView,
	CreateView,
	UpdateView,
	DeleteView
)
from .models import Wiki, Post, MathBook

# Create your views here.
def homepage(request):
	return render(request, "wikis/home.html")


def about(request):
	return render(request, "wikis/about.html", {"title": "About"})


def birds(request):
	return render(request, "wikis/birdMap.html", {"title": "Birds"})


@login_required
def secret(request):
	if request.user.username in ['benclingenpeel', 'nina']:
		return render(request, "wikis/secret.html", {"title": "Secret Page"})
	else:
		raise PermissionDenied


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


class WikiCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
	model = Wiki 
	fields = ["title", "slug", "content"]

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)

	def test_func(self):
		if self.request.user.username == "benclingenpeel":
			return True
		return False


class WikiUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
	model = Wiki
	fields = ["title", "slug", "content"]

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)

	def test_func(self):
		if self.request.user.username == "benclingenpeel":
			return True
		return False


class WikiDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
	model = Wiki 
	success_url = "/wiki/"

	def test_func(self):
		if self.request.user.username == "benclingenpeel":
			return True
		return False


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


class PostCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
	model = Post
	fields = ["title", "slug", "content"]

	def form_valid(self, form):
		form.instance.author = self.request.user
		return super().form_valid(form)

	def test_func(self):
		if self.request.user.username == "benclingenpeel":
			return True
		return False


class TextbookListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
	model = MathBook
	template_name = "wikis/problems.html"
	context_object_name = "textbooks"
	ordering = ["-year_used"]

	def get_context_data(self, *args, **kwargs):
		context = super(TextbookListView, self).get_context_data(*args, **kwargs)
		context['title'] = "Problems and Solutions"
		return context

	def test_func(self):
		if self.request.user.username == "benclingenpeel":
			return True
		return False
