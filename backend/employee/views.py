from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib import messages
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.core.mail import send_mail

from core.decorators import role_required, employee_required
from core.models import RoleType, CustomerOrder, Outlet, Employee, Customer
from core.services import InventoryService

# Helpers
def user_is_role(user, role_value):
    return getattr(user, 'role', None) == role_value


@method_decorator(login_required, name='dispatch')
class EmployeeIndexView(View):
    def get(self, request):
        # Redirect employees to their role-specific dashboard
        user = request.user
        if user.role == RoleType.MANAGER:
            return redirect('manager-dashboard')
        if user.role == RoleType.FACTORY_MANAGER:
            return redirect('factory-dashboard')
        if user.role == RoleType.SALESPERSON:
            return redirect('sales-dashboard')
        return HttpResponseForbidden('Access denied')


# ------------------------
# Manager
# ------------------------
@method_decorator([login_required, role_required(RoleType.MANAGER)], name='dispatch')
class ManagerDashboardView(View):
    def get(self, request):
        # Read-only reports (simple aggregates for now)
        total_products = InventoryService.count_products()
        pending_orders = CustomerOrder.objects.filter(status='PENDING').count()
        outlets = Outlet.objects.count()

        context = {
            'total_products': total_products,
            'pending_orders': pending_orders,
            'outlets': outlets,
            'user': request.user
        }
        return render(request, 'employee/manager_dashboard.html', context)


# ------------------------
# Factory Manager
# ------------------------
@method_decorator([login_required, role_required(RoleType.FACTORY_MANAGER)], name='dispatch')
class FactoryManagerDashboardView(View):
    def get(self, request):
        # Product list via InventoryService and orders grouped by outlet
        products = InventoryService.list_all_products()
        # Group orders by outlet for quick overview
        orders_by_outlet = {}
        for o in CustomerOrder.objects.select_related('outlet').order_by('-order_date'):
            key = o.outlet.outlet_name if o.outlet else 'Unknown'
            orders_by_outlet.setdefault(key, []).append(o)

        context = {
            'products': products,
            'orders_by_outlet': orders_by_outlet,
            'user': request.user
        }
        return render(request, 'employee/factory_dashboard.html', context)


# Update order status endpoint (Factory managers can update to PREPARING, DISPATCHED etc.)
@login_required
@role_required(RoleType.FACTORY_MANAGER)
def update_order_status(request, order_id):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST required')

    status = request.POST.get('status')
    if not status:
        return HttpResponseBadRequest('Missing status')

    order = get_object_or_404(CustomerOrder, pk=order_id)
    # Validate status is allowed
    allowed = [s for s, _ in CustomerOrder._meta.get_field('status').choices]
    if status not in allowed:
        return HttpResponseBadRequest('Invalid status')

    order.status = status
    order.save(update_fields=['status'])
    messages.success(request, f'Order {order.order_id} updated to {status}')
    return redirect('factory-dashboard')


# ------------------------
# Salesperson
# ------------------------
@method_decorator([login_required, role_required(RoleType.SALESPERSON)], name='dispatch')
class SalespersonDashboardView(View):
    def get(self, request):
        # Salesperson sees orders for assigned outlet
        try:
            emp = request.user.employee_profile
        except Employee.DoesNotExist:
            return HttpResponseForbidden('Employee profile missing')

        outlet = emp.outlet
        orders = CustomerOrder.objects.filter(outlet=outlet).order_by('-order_date')
        context = {
            'orders': orders,
            'outlet': outlet,
            'user': request.user
        }
        return render(request, 'employee/sales_dashboard.html', context)


@login_required
@role_required(RoleType.SALESPERSON)
def mark_order_received(request, order_id):
    if request.method != 'POST':
        return HttpResponseBadRequest('POST required')

    try:
        emp = request.user.employee_profile
    except Employee.DoesNotExist:
        return HttpResponseForbidden('Employee profile missing')

    order = get_object_or_404(CustomerOrder, pk=order_id, outlet=emp.outlet)

    # Mark as READY_FOR_PICKUP (or COMPLETED depending on your workflow)
    order.status = 'READY_FOR_PICKUP'
    order.save(update_fields=['status'])

    # Notify customer via email (best-effort)
    try:
        cust_user = order.customer.user
        if cust_user.email:
            send_mail(
                subject=f'Your order #{order.order_id} is ready',
                message=f'Hello {cust_user.first_name or cust_user.username},\nYour order #{order.order_id} is ready for pickup at {order.outlet.outlet_name}.',
                from_email=None,
                recipient_list=[cust_user.email],
                fail_silently=True,
            )
    except Exception:
        # Do not fail the request if mail sending fails
        pass

    messages.success(request, f'Order {order.order_id} marked as ready and customer notified')
    return redirect('sales-dashboard')
