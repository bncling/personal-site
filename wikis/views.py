from django.shortcuts import render

# Create your views here.
def homepage(request):
	return render(request, "wikis/home.html")

def about(request):
	return render(request, "wikis/about.html", {"title": "About"})

def birds(request):
	return render(request, "wikis/birdMap.html", {"title": "Birds"})
