from django.db import models
from django.utils import timezone

# Create your models here.
class Wiki(models.Model):
	title = models.CharField(max_length = 100)
	content = models.TextField()
	date_posted = models.DateTimeField(default = timezone.now)
	slug = models.SlugField()

	def __str__(self):
		return self.title


class Post(models.Model):
	title = models.CharField(max_length = 100)
	content = models.TextField()
	date_posted = models.DateTimeField(default = timezone.now)
	slug = models.SlugField()

	def __str__(self):
		return self.title


class MathBook(models.Model):
	title = models.CharField(max_length = 150)
	author = models.CharField(max_length = 150)
	year_used = models.DateTimeField(default = timezone.now)
	image_link = models.TextField()
	file_link = models.TextField()

	def __str__(self):
		return self.title