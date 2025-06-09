from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("send/", views.send_message, name="send_message"),
    path("messages/", views.get_messages, name="get_messages"),
]
