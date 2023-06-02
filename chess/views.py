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