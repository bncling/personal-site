# Generated by Django 4.2 on 2023-05-10 03:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wikis", "0003_wiki_name"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="wiki",
            name="name",
        ),
        migrations.AddField(
            model_name="wiki",
            name="slug",
            field=models.SlugField(default="temp-slug"),
            preserve_default=False,
        ),
    ]
