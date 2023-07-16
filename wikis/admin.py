from django.contrib import admin
from .models import Wiki, Post, MathBook, SecretPhoto

# Register your models here.
admin.site.register(Wiki)
admin.site.register(Post)
admin.site.register(MathBook)
admin.site.register(SecretPhoto)