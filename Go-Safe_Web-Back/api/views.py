from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth import authenticate

@csrf_exempt
def login_admin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para login_admin:", data)  # Imprimir los datos recibidos
            user = authenticate(username=data['email'], password=data['password'])
            if user is not None and user.is_staff:
                print("Usuario autenticado:", user.username)  # Imprimir el nombre de usuario autenticado
                return JsonResponse({'message': 'Login successful', 'user': user.username})
            else:
                print("Credenciales inválidas")  # Imprimir mensaje de credenciales inválidas
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except Exception as e:
            print("Error en login_admin:", str(e))  # Imprimir el error
            return JsonResponse({'error': str(e)}, status=500)
    print("Método de solicitud inválido para login_admin")  # Imprimir mensaje de método de solicitud inválido
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_conductor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para login_conductor:", data)  # Imprimir los datos recibidos
            user = authenticate(username=data['email'], password=data['password'])
            if user is not None and not user.is_staff:
                print("Usuario autenticado:", user.username)  # Imprimir el nombre de usuario autenticado
                return JsonResponse({'message': 'Login successful', 'user': user.username})
            else:
                print("Credenciales inválidas")  # Imprimir mensaje de credenciales inválidas
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except Exception as e:
            print("Error en login_conductor:", str(e))  # Imprimir el error
            return JsonResponse({'error': str(e)}, status=500)
    print("Método de solicitud inválido para login_conductor")  # Imprimir mensaje de método de solicitud inválido
    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User

@csrf_exempt
def create_conductor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para crear conductor:", data)  # Imprimir los datos recibidos
            user = User.objects.create_user(
                username=data['correo'],
                email=data['correo'],
                password=data['contraseña'],
                first_name=data['nombre_completo'],
                last_name=data['apellido']
            )
            user.is_staff = False
            user.save()
            return JsonResponse({'message': 'Conductor creado exitosamente', 'user': user.username})
        except Exception as e:
            print("Error al crear conductor:", str(e))  # Imprimir el error
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

""" from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Vehiculo, Conductor

@csrf_exempt
def create_vehiculo(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Datos recibidos para crear vehículo:", data)  # Imprimir los datos recibidos

            # Verificar si el conductor existe
            conductor = Conductor.objects.get(id=data['id_conductor'])
            if not conductor:
                return JsonResponse({'error': 'Conductor no encontrado.'}, status=400)

            vehiculo = Vehiculo.objects.create(
                marca=data['marca'],
                modelo=data['modelo'],
                numero_taxi=data['numero_taxi'],
                id_conductor=conductor,
                activo=data['activo']
            )
            vehiculo.save()
            return JsonResponse({'message': 'Vehículo creado exitosamente', 'id': vehiculo.id})
        except Conductor.DoesNotExist:
            return JsonResponse({'error': 'Conductor no encontrado.'}, status=400)
        except Exception as e:
            print("Error al crear vehículo:", str(e))  # Imprimir el error
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405) """