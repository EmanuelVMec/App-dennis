from django.contrib import admin
from django.urls import path
from chat import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('api/send/', views.send_message, name='send_message'),
    path('api/messages/<int:carrera_id>/', views.get_messages_by_carrera, name='get_messages_by_carrera'),
]
