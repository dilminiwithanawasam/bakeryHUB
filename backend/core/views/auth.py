# FILE: backend/core/views/auth.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db import transaction  # The "Safety Switch"
from core.models import User, Employee, Customer, RoleType, Outlet
from core.permissions import IsAdmin


# ==========================================
# 1. LOGIN (Universal)
# ==========================================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Django checks the DB and Password Hash automatically
        user = authenticate(username=username, password=password)

        if user is not None:
            # 1. Generate the Key (Token)
            refresh = RefreshToken.for_user(user)

            # 2. Prepare the data to send back
            response_data = {
                'token': str(refresh.access_token),
                'user': {
                    'username': user.username,
                    'role': user.role,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'contact_number': user.contact
                }
            }

            # 3. If it's a Staff member, send their Outlet ID (Useful for POS)
            if user.is_employee:
                try:
                    # Access the linked profile safely
                    if hasattr(user, 'employee_profile'):
                        employee_profile = user.employee_profile
                        if employee_profile.outlet:
                            response_data['user']['outlet_id'] = employee_profile.outlet.outlet_id
                            response_data['user']['outlet_name'] = employee_profile.outlet.outlet_name
                except Employee.DoesNotExist:
                    pass

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# ==========================================
# 2. CUSTOMER REGISTRATION (Self-Service)
# ==========================================
class CustomerRegisterView(APIView):
    permission_classes = [AllowAny]  # Open to the public

    def post(self, request):
        data = request.data

        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        contact = data.get('contact_number') or data.get('contact') or data.get('phone_number')

        # Basic presence checks
        if not username or not password:
            return Response({"error": "username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Unique username
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        # Email validations
        if email:
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)

        # Contact number required and unique
        if not contact:
            return Response({"error": "contact_number is required"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(contact_number=contact).exists() or User.objects.filter(phone_number=contact).exists():
            return Response({"error": "Contact number already in use"}, status=status.HTTP_400_BAD_REQUEST)

        # Strong password validation
        from django.contrib.auth.password_validation import validate_password
        try:
            validate_password(password)
        except Exception as e:
            # validate_password can return a list of errors or raise ValidationError
            return Response({"error": "; ".join(e.messages) if hasattr(e, 'messages') else str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():  # <--- Start Safety Block

                # 1. Create the Login User
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=data.get('first_name'),
                    last_name=data.get('last_name'),
                    role=RoleType.CUSTOMER,  # Force role to Customer
                    contact_number=contact
                )

                # 2. Create the Customer Profile
                Customer.objects.create(
                    user=user,
                    address=data.get('address', ''),
                    loyalty_points=0
                )

            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# 3. EMPLOYEE CREATION (Admin Only)
# ==========================================
class EmployeeCreateView(APIView):
    permission_classes = [IsAdmin]  # Only Admin can hire people

    def post(self, request):
        data = request.data

        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                # 1. Create the Login User
                # Default to SALESPERSON if role is missing
                role_to_assign = data.get('role', RoleType.SALESPERSON)

                user = User.objects.create_user(
                    username=data['username'],
                    email=data.get('email'),
                    password=data['password'],
                    first_name=data.get('first_name'),
                    last_name=data.get('last_name'),
                    role=role_to_assign,
                    is_active=True
                )

                # 2. Find the Outlet (Shop) they work at
                outlet_instance = None
                if 'outlet_id' in data:
                    try:
                        outlet_instance = Outlet.objects.get(pk=data['outlet_id'])
                    except Outlet.DoesNotExist:
                        return Response({"error": "Outlet not found"}, status=status.HTTP_404_NOT_FOUND)

                # 3. Create the Employee Profile
                Employee.objects.create(
                    user=user,
                    nic=data['nic'],
                    hire_date=data.get('hire_date', '2024-01-01'),
                    outlet=outlet_instance
                )

            return Response({"message": f"Employee {data['username']} created successfully!"},
                            status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)