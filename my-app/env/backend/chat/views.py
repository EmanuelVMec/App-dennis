from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Carrera, Message
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
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Usuario no autenticado"}, status=400)

    try:
        data = json.loads(request.body)
        print(data)  # Verifica qué datos se están recibiendo
        text = data.get("text")
        carrera_id = data.get("carrera_id")

        if not text:
            return JsonResponse({"error": "No se proporcionó texto para el mensaje"}, status=400)

        carrera = None
        if carrera_id:
            try:
                carrera = Carrera.objects.get(id=carrera_id)
            except Carrera.DoesNotExist:
                return JsonResponse({"error": "Carrera no encontrada"}, status=400)

        Message.objects.create(user=request.user, text=text, carrera=carrera)
        return JsonResponse({"message": "Mensaje enviado correctamente"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Solicitud mal formada"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

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

def get_messages_by_carrera(request, carrera_id):
    if request.method == "GET":
        messages = Message.objects.filter(carrera_id=carrera_id).order_by('created_at')
        messages_data = [{"text": message.text, "user": message.user.username, "created_at": message.created_at} for message in messages]
        return JsonResponse({"messages": messages_data})