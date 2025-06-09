from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Message
import json

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        if not username or not password:
            return JsonResponse({"error": "Campos incompletos"}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Usuario ya existe"}, status=400)
        User.objects.create_user(username=username, password=password)
        return JsonResponse({"message": "Usuario creado correctamente"})
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Inicio de sesión exitoso"})
        else:
            return JsonResponse({"error": "Credenciales inválidas"}, status=400)
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"message": "Sesión cerrada"})
    return JsonResponse({"error": "Método no permitido"}, status=405)

@csrf_exempt
def send_message(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "No autenticado"}, status=401)
        data = json.loads(request.body)
        text = data.get("text", "").strip()
        if not text:
            return JsonResponse({"error": "Mensaje vacío"}, status=400)
        Message.objects.create(user=request.user, text=text)
        return JsonResponse({"message": "Mensaje enviado"})
    return JsonResponse({"error": "Método no permitido"}, status=405)

def get_messages(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            return JsonResponse({"error": "No autenticado"}, status=401)
        messages = Message.objects.all().order_by("-created_at")
        data = [
            {"text": m.text, "sender": "Anónimo", "timestamp": m.created_at}
            for m in messages
        ]
        return JsonResponse(data, safe=False)
    return JsonResponse({"error": "Método no permitido"}, status=405)
