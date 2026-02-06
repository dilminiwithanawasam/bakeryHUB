from django.contrib import admin
from django.apps import apps
from django.contrib import messages

from core.models import (
    User, Employee, Customer, RoleType,
    Outlet, Product, Batch, OutletStock,
    Sale, SaleItem, Payment,
    CustomerOrder, CustomerOrderItem,
    Wastage
)

# ---------------------------
# Helper admin actions
# ---------------------------

def activate_users(modeladmin, request, queryset):
    updated = 0
    for user in queryset:
        if not user.is_active:
            user.is_active = True
            user.save(update_fields=['is_active'])
            updated += 1
    messages.success(request, f"Activated {updated} user(s)")
activate_users.short_description = 'Activate selected users'


def deactivate_users(modeladmin, request, queryset):
    updated = 0
    for user in queryset:
        if user.is_active:
            user.is_active = False
            user.save(update_fields=['is_active'])
            updated += 1
    messages.success(request, f"Deactivated {updated} user(s)")
deactivate_users.short_description = 'Deactivate selected users'


# ---------------------------
# User admin — employee-focused view
# ---------------------------
class EmployeeUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'contact_number_display', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    actions = [activate_users, deactivate_users]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Hide Customers from this admin view (employee-focused)
        return qs.exclude(role=RoleType.CUSTOMER)

    def contact_number_display(self, obj):
        return obj.contact or obj.phone_number
    contact_number_display.short_description = 'Contact'


# ---------------------------
# Employee admin (profile model)
# ---------------------------
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'contact_number', 'nic', 'hire_date', 'outlet', 'is_active')
    list_filter = ('outlet', 'user__role', 'user__is_active')
    search_fields = ('user__username', 'user__email', 'nic')
    actions = []

    def username(self, obj):
        return obj.user.username
    username.admin_order_field = 'user__username'

    def email(self, obj):
        return obj.user.email
    email.admin_order_field = 'user__email'

    def role(self, obj):
        return obj.user.role
    role.admin_order_field = 'user__role'

    def contact_number(self, obj):
        return obj.user.contact or obj.user.phone_number
    contact_number.short_description = 'Contact'

    def is_active(self, obj):
        return obj.user.is_active
    is_active.boolean = True
    is_active.admin_order_field = 'user__is_active'

    # Admin actions for employee activation/deactivation operate on the related user
    def activate_employees(self, request, queryset):
        users = [e.user for e in queryset]
        activate_users(self, request, User.objects.filter(pk__in=[u.pk for u in users]))
    activate_employees.short_description = 'Activate selected employees'

    def deactivate_employees(self, request, queryset):
        users = [e.user for e in queryset]
        deactivate_users(self, request, User.objects.filter(pk__in=[u.pk for u in users]))
    deactivate_employees.short_description = 'Deactivate selected employees'

    actions = ['activate_employees', 'deactivate_employees']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Ensure this admin only shows rows which are actual employees (exclude Customer profiles if any)
        return qs.filter(user__role__in=[RoleType.ADMIN, RoleType.OWNER, RoleType.MANAGER, RoleType.FACTORY_MANAGER, RoleType.SALESPERSON])


# ---------------------------
# Outlet admin
# ---------------------------
class OutletAdmin(admin.ModelAdmin):
    list_display = ('outlet_name', 'location', 'contact_no', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('outlet_name', 'location', 'contact_no')


# ---------------------------
# Product admin
# ---------------------------
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'category', 'base_price', 'shelf_life_days', 'measurement_type', 'is_active')
    list_filter = ('category', 'is_active', 'measurement_type')
    search_fields = ('product_name', 'description', 'category')


# ---------------------------
# Batch admin
# ---------------------------
class BatchAdmin(admin.ModelAdmin):
    list_display = ('batch_no', 'product', 'quantity_produced', 'manufactured_date', 'expiry_date')
    list_filter = ('product', 'manufactured_date', 'expiry_date')
    search_fields = ('batch_no', 'product__product_name')
    date_hierarchy = 'manufactured_date'


# ---------------------------
# OutletStock admin
# ---------------------------
class OutletStockAdmin(admin.ModelAdmin):
    list_display = ('outlet', 'batch', 'current_quantity', 'last_updated')
    list_filter = ('outlet', 'last_updated')
    search_fields = ('outlet__outlet_name', 'batch__batch_no')


# ---------------------------
# Sale admin
# ---------------------------
class SaleAdmin(admin.ModelAdmin):
    list_display = ('bill_no', 'outlet', 'employee', 'sale_date', 'net_amount', 'status')
    list_filter = ('outlet', 'status', 'sale_date')
    search_fields = ('bill_no', 'outlet__outlet_name', 'employee__user__username')
    date_hierarchy = 'sale_date'
    readonly_fields = ('bill_no', 'sale_date')


# ---------------------------
# SaleItem admin
# ---------------------------
class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0
    readonly_fields = ('subtotal',)


class SaleItemAdmin(admin.ModelAdmin):
    list_display = ('sale', 'batch', 'quantity', 'unit_price', 'subtotal')
    list_filter = ('sale__outlet',)
    search_fields = ('sale__bill_no', 'batch__batch_no')


# ---------------------------
# Payment admin
# ---------------------------
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'amount', 'payment_method', 'payment_status', 'payment_date')
    list_filter = ('payment_method', 'payment_status', 'payment_date')
    search_fields = ('reference_no', 'sale__bill_no')
    date_hierarchy = 'payment_date'
    readonly_fields = ('payment_date',)


# ---------------------------
# CustomerOrder admin
# ---------------------------
class CustomerOrderItemInline(admin.TabularInline):
    model = CustomerOrderItem
    extra = 0


class CustomerOrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'outlet', 'order_date', 'pickup_date', 'status', 'total_amount')
    list_filter = ('outlet', 'status', 'order_date', 'pickup_date')
    search_fields = ('customer__user__username', 'order_id')
    date_hierarchy = 'order_date'
    inlines = [CustomerOrderItemInline]
    readonly_fields = ('order_date', 'order_id')


# ---------------------------
# CustomerOrderItem admin
# ---------------------------
class CustomerOrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'unit_price')
    list_filter = ('order__outlet',)
    search_fields = ('order__order_id', 'product__product_name')


# ---------------------------
# Wastage admin
# ---------------------------
class WastageAdmin(admin.ModelAdmin):
    list_display = ('outlet', 'batch', 'quantity', 'reason', 'recorded_by_employee', 'recorded_at')
    list_filter = ('outlet', 'reason', 'recorded_at')
    search_fields = ('outlet__outlet_name', 'batch__batch_no', 'notes')
    date_hierarchy = 'recorded_at'
    readonly_fields = ('recorded_at',)
# First unregister any auto-registered models to avoid duplicate registrations
app = apps.get_app_config('core')
for model in app.get_models():
    try:
        admin.site.unregister(model)
    except Exception:
        pass

# Register our customized admins
admin.site.register(User, EmployeeUserAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Customer)

# Register business models with custom admins
admin.site.register(Outlet, OutletAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Batch, BatchAdmin)
admin.site.register(OutletStock, OutletStockAdmin)

# Register sales & payments
admin.site.register(Sale, SaleAdmin)
admin.site.register(SaleItem, SaleItemAdmin)
admin.site.register(Payment, PaymentAdmin)

# Register customer orders
admin.site.register(CustomerOrder, CustomerOrderAdmin)
admin.site.register(CustomerOrderItem, CustomerOrderItemAdmin)

# Register wastage
admin.site.register(Wastage, WastageAdmin)

# ---------------------------
# Restrict admin site access to ADMIN role only
# ---------------------------
from core.models import RoleType as _RoleType

_original_has_permission = admin.site.has_permission

def _admin_has_permission(request):
    # Keep original checks for staff/superuser if desired, but enforce ADMIN role as primary condition
    user = getattr(request, 'user', None)
    if not user or not user.is_authenticated:
        return False
    # Only allow users whose role is ADMIN
    if getattr(user, 'role', None) != _RoleType.ADMIN:
        return False
    return True

admin.site.has_permission = _admin_has_permission