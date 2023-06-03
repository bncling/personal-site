from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

import json
from pathlib import Path

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
			path_ending = "white-rep.json"
			if data["color"] == "b":
				redirection_view = black_rep_editing
				path_ending = "black-rep.json"
			rep_path = str(Path(__file__).parents[1]) + "/wikis/static/wikis/" + path_ending
			with open(rep_path, "w") as f:
				json.dump(data["rep"], f)
			return redirect(redirection_view)
	else:
		raise PermissionDenied