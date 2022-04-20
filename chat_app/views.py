from django.http import JsonResponse
from .models import Profile, Room
from .serializers import RoomSerializer, ProfileSerializer
from rest_framework.viewsets import ModelViewSet


def api_users(request):
    if request.method == 'GET':
        users = Profile.objects.all()
        serializer = ProfileSerializer(users, many=True)
        return JsonResponse(serializer.data, safe=False)


class ApiUsers(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ApiRooms(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
