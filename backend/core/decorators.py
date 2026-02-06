from functools import wraps
from django.http import HttpResponseForbidden

from core.models import RoleType


def role_required(role):
    """Decorator for function-based views to require a specific role.

    Usage:
        @role_required(RoleType.SALESPERSON)
        def view(request): ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            user = getattr(request, 'user', None)
            if not user or not user.is_authenticated:
                return HttpResponseForbidden('Authentication required')
            if user.role != role:
                return HttpResponseForbidden('Insufficient role')
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator


def employee_required(view_func):
    """Decorator that allows any employee role (ADMIN, MANAGER, FACTORY_MANAGER, SALESPERSON)."""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return HttpResponseForbidden('Authentication required')
        if not user.is_employee:
            return HttpResponseForbidden('Employee access only')
        return view_func(request, *args, **kwargs)
    return _wrapped_view


def admin_required(view_func):
    """Decorator that allows only ADMIN users."""
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return HttpResponseForbidden('Authentication required')
        if not user.is_admin:
            return HttpResponseForbidden('Admin access only')
        return view_func(request, *args, **kwargs)
    return _wrapped_view