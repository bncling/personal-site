from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

import json

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
			data = json.loads(request.POST["data"])
			redirection_view = white_rep_editing
			if data["color"] == "b":
				redirection_view = black_rep_editing
			return redirect(redirection_view)
	else:
		raise PermissionDenied