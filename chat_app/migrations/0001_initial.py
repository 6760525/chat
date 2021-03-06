# Generated by Django 4.0.4 on 2022-04-20 01:28

from django.db import migrations, models
import django.db.models.deletion
import easy_thumbnails.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, unique=True)),
                ('avatar', easy_thumbnails.fields.ThumbnailerImageField(default='chat/default.jpg', upload_to='chat')),
                ('avatar_small', easy_thumbnails.fields.ThumbnailerImageField(default='chat/default_small.jpg', upload_to='chat')),
                ('online', models.BooleanField(default=False)),
                ('room', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='chat_app.room')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=255)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat_app.profile')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat_app.room')),
            ],
        ),
    ]
