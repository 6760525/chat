from django.db import models
from easy_thumbnails.fields import ThumbnailerImageField


class Room(models.Model):
    name = models.CharField(max_length=256, unique=True)


class Profile(models.Model):
    name = models.CharField(max_length=256, unique=True)
    avatar = ThumbnailerImageField(resize_source={'size': (300, 300), 'crop': 'smart'}, upload_to='chat', default='chat/default.jpg')
    avatar_small = ThumbnailerImageField(resize_source={'size': (30, 30), 'crop': 'smart'}, upload_to='chat', default='chat/default_small.jpg')
    room = models.OneToOneField(Room, on_delete=models.SET_NULL, null=True)
    online = models.BooleanField(default=False)

    def user_list(self):
        users = Profile.objects.filter().order_by('name')
        return list(users)


class Message(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
