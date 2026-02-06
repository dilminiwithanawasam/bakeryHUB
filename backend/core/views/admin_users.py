from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from core.models import User, Employee, Outlet
from core.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated


class AdminUserList(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = User.objects.all().values(
            'id', 'username', 'first_name', 'last_name', 'email', 'role', 'is_active', 'contact_number'
        )
        return Response({'users': list(users)}, status=status.HTTP_200_OK)


class AdminUserDetail(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role,
            'is_active': user.is_active,
            'contact_number': user.contact_number,
        }
        return Response({'user': data}, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        data = request.data
        # Allow updating role and active status and basic info
        if 'role' in data:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        if 'contact_number' in data:
            user.contact_number = data['contact_number']
        user.save()
        return Response({'message': 'User updated successfully'}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        username = user.username
        user.delete()
        return Response({'message': f'User {username} deleted'}, status=status.HTTP_200_OK)


class AdminEmployeeList(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        employees = Employee.objects.select_related('user', 'outlet').all()
        data = []
        for e in employees:
            data.append({
                'id': e.user.id,
                'username': e.user.username,
                'first_name': e.user.first_name,
                'last_name': e.user.last_name,
                'role': e.user.role,
                'is_active': e.user.is_active,
                'contact_number': e.user.contact_number,
                'nic': e.nic,
                'hire_date': e.hire_date,
                'outlet': {
                    'id': e.outlet.outlet_id,
                    'name': e.outlet.outlet_name
                } if e.outlet else None
            })
        return Response({'employees': data}, status=status.HTTP_200_OK)


class AdminEmployeeDetail(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        try:
            employee = user.employee_profile
            data = {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'is_active': user.is_active,
                'contact_number': user.contact_number,
                'nic': employee.nic,
                'hire_date': employee.hire_date,
                'outlet': employee.outlet.outlet_id if employee.outlet else None,
            }
            return Response({'employee': data}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        data = request.data
        if 'role' in data:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        if 'contact_number' in data:
            user.contact_number = data['contact_number']
        user.save()

        # update employee profile if present
        try:
            employee = user.employee_profile
            if 'nic' in data:
                employee.nic = data['nic']
            if 'hire_date' in data:
                employee.hire_date = data['hire_date']
            if 'outlet_id' in data:
                try:
                    employee.outlet = Outlet.objects.get(pk=data['outlet_id'])
                except Outlet.DoesNotExist:
                    return Response({'error': 'Outlet not found'}, status=status.HTTP_404_NOT_FOUND)
            employee.save()
        except Employee.DoesNotExist:
            pass

        return Response({'message': 'Employee updated successfully'}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        try:
            user.employee_profile.delete()
        except Employee.DoesNotExist:
            pass
        username = user.username
        user.delete()
        return Response({'message': f'Employee {username} deleted'}, status=status.HTTP_200_OK)
