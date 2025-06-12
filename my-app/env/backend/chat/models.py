# models.py
from django.db import models
from django.contrib.auth.models import User

# Crear el modelo Carrera
class Carrera(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

# Modificar el modelo Message para asociarlo con una Carrera
class Message(models.Model):
    text = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    carrera = models.ForeignKey(Carrera, on_delete=models.CASCADE, default=1)  # Valor por defecto de carrera con ID 1
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.user.username} in {self.carrera.nombre} at {self.created_at}"
