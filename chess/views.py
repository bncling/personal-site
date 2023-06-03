from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

@login_required
def chess(request):
	if request.user.username == "benclingenpeel":
		return render(request, "chess/chess.html", {"title": "Chess"})
	else:
		raise PermissionDenied


@login_required
def white_rep_training(request):
	if request.user.username == "benclingenpeel":
		return render(request, "chess/training.html", {"title": "Repertoire Training", "color": "w"})
	else:
		raise PermissionDenied


@login_required
def black_rep_training(request):
	if request.user.username == "benclingenpeel":
		return render(request, "chess/training.html", {"title": "Repertoire Training", "color": "b"})
	else:
		raise PermissionDenied


@login_required
def white_rep_editing(request):
	if request.user.username == "benclingenpeel":
		return render(request, "chess/opening_rep.html", {
			"title": "Repertoire Editing",
			"color": "w"
		})
	else:
		raise PermissionDenied


@login_required
def black_rep_editing(request):
	if request.user.username == "benclingenpeel":
		return render(request, "chess/opening_rep.html", {
			"title": "Repertoire Editing",
			"color": "b"
		})
	else:
		raise PermissionDenied


@login_required
def save_rep(request):
	if request.user.username == "benclingenpeel":
		if request.method == "POST":
			print(request.POST["data"])
			return render(request, "chess/chess.html")
	else:
		raise PermissionDenied