from rest_framework.permissions import BasePermission
from core.models import RoleType

class IsEmployee(BasePermission):
    """
    Allows access to any staff member (Admin, Manager, Sales, Factory).
    Blocks Customers.
    """
    def has_permission(self, request, view):
        # We use the helper property .is_employee we defined in models.py
        return bool(request.user and request.user.is_authenticated and request.user.is_employee)

class IsAdmin(BasePermission):
    """
    Allows access ONLY to Admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == RoleType.ADMIN)

class IsManagerOrOwner(BasePermission):
    """
    Allows access to Managers, Owners, and Admins.
    """
    def has_permission(self, request, view):
        allowed_roles = [RoleType.MANAGER, RoleType.OWNER, RoleType.ADMIN]
        return bool(request.user and request.user.is_authenticated and request.user.role in allowed_roles)

class IsCustomer(BasePermission):
    """
    Allows access ONLY to Customers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == RoleType.CUSTOMER)