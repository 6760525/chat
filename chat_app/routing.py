from django.urls import re_path
from .chat import WSConsumer, WSChat


ws_urlpatterns = [
    re_path(r'ws/instructions/', WSConsumer.as_asgi()),
    re_path(r'ws/chat/', WSChat.as_asgi()),
]

channel_routing = {
    'websocket.connect': 'chat_app.chat.WSConsumer.as_asgi()',
    'websocket.receive': 'chat_app.chat.WSConsumer.as_asgi()',
    'websocket.disconnect': 'chat_app.chat.WSConsumer.as_asgi()',
}
