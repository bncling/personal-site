# Generated by Django 4.2 on 2023-05-11 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("wikis", "0007_mathbook_year_used"),
    ]

    operations = [
        migrations.AddField(
            model_name="mathbook",
            name="author",
            field=models.CharField(default="temp-author", max_length=150),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="mathbook",
            name="title",
            field=models.CharField(max_length=150),
        ),
    ]
