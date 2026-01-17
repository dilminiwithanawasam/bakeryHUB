from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow if logged in AND role is ADMIN
        return request.user.is_authenticated and request.user.role.role_name == 'ADMIN'

class IsFactoryDistributor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.role_name == 'FACTORY_DISTRIBUTOR'

class IsSalesperson(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.role_name == 'SALESPERSON'