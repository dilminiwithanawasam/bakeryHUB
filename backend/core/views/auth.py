from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import User, Role, Employee
from core.permissions import IsAdmin


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User.objects.get(username=username)
            if user.password_hash == password:
                refresh = RefreshToken.for_user(user)
                role_name = user.role.role_name if user.role else "EMPLOYEE"

                return Response({
                    'token': str(refresh.access_token),
                    'user': {'username': user.username, 'role': role_name}
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_401_UNAUTHORIZED)


class EmployeeRegisterView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        try:
            data = request.data
            role_name = data.get('role', 'SALESPERSON')
            role, _ = Role.objects.get_or_create(role_name=role_name)

            if User.objects.filter(username=data['username']).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create(
                username=data['username'],
                email=data['email'],
                password_hash=data['password'],
                role=role,
                is_active=True
            )

            Employee.objects.create(
                user=user,
                first_name=data['first_name'],
                last_name=data['last_name'],
                nic=data['nic'],
                contact_no=data['contact_no'],
                hire_date=data['hire_date']
            )

            return Response({"message": "Employee created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)