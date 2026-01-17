# backend/core/models.py
from django.db import models
from django.utils import timezone

# ==========================================
# 1. ENUMS (Choices)
# ==========================================
class RoleType(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    MANAGER = 'MANAGER', 'Manager'
    SALESPERSON = 'SALESPERSON', 'Salesperson'
    FACTORY_DISTRIBUTOR = 'FACTORY_DISTRIBUTOR', 'Factory Distributor'
    CUSTOMER = 'CUSTOMER', 'Customer'

class OrderStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    PREPARING = 'PREPARING', 'Preparing'
    READY_FOR_PICKUP = 'READY_FOR_PICKUP', 'Ready for Pickup'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'
    DISPATCHED = 'DISPATCHED', 'Dispatched'

class EmploymentStatus(models.TextChoices):
    ACTIVE = 'ACTIVE', 'Active'
    ON_LEAVE = 'ON_LEAVE', 'On Leave'
    TERMINATED = 'TERMINATED', 'Terminated'
    RESIGNED = 'RESIGNED', 'Resigned'

class MeasurementType(models.TextChoices):
    PCS = 'PCS', 'Pcs'
    KG = 'KG', 'Kg'
    BOX = 'BOX', 'Box'
    LITRE = 'LITRE', 'Litre'

class PaymentMethod(models.TextChoices):
    CASH = 'CASH', 'Cash'
    CARD = 'CARD', 'Card'
    ONLINE_TRANSFER = 'ONLINE_TRANSFER', 'Online Transfer'

class PaymentStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    SUCCESS = 'SUCCESS', 'Success'
    FAILED = 'FAILED', 'Failed'
    REFUNDED = 'REFUNDED', 'Refunded'

class RestockStatus(models.TextChoices):
    GENERATED = 'GENERATED', 'Generated'
    SENT_TO_FACTORY = 'SENT_TO_FACTORY', 'Sent to Factory'
    DISPATCHED = 'DISPATCHED', 'Dispatched'
    RECEIVED = 'RECEIVED', 'Received'

class SaleStatus(models.TextChoices):
    COMPLETED = 'COMPLETED', 'Completed'
    REFUNDED = 'REFUNDED', 'Refunded'

class WastageReason(models.TextChoices):
    EXPIRED_AUTOMATIC = 'EXPIRED_AUTOMATIC', 'Expired Automatic'
    DAMAGED_IN_STORE = 'DAMAGED_IN_STORE', 'Damaged in Store'
    PRODUCTION_FAILURE = 'PRODUCTION_FAILURE', 'Production Failure'
    OTHER = 'OTHER', 'Other'

# ==========================================
# 2. MODELS (The Tables)
# ==========================================

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=50, unique=True, choices=RoleType.choices)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'roles'

    def __str__(self):
        return self.role_name

class Permission(models.Model):
    permission_id = models.AutoField(primary_key=True)
    permission_slug = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'permissions'

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    password_hash = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=100, blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    is_active = models.BooleanField(default=True, blank=True, null=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username

    # --- AUTHENTICATION HELPERS ---
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    shelf_life_days = models.IntegerField()
    measurement_type = models.CharField(max_length=20, choices=MeasurementType.choices)
    is_active = models.BooleanField(default=True, blank=True, null=True)

    class Meta:
        db_table = 'products'

    def __str__(self):
        return self.product_name

class Batch(models.Model):
    batch_id = models.AutoField(primary_key=True)
    batch_no = models.CharField(max_length=50, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_produced = models.IntegerField()
    manufactured_date = models.DateField()
    expiry_date = models.DateField()

    class Meta:
        db_table = 'batches'

    def __str__(self):
        return self.batch_no

class Outlet(models.Model):
    outlet_id = models.AutoField(primary_key=True)
    outlet_name = models.CharField(max_length=100)
    location = models.TextField()
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    opening_time = models.TimeField(blank=True, null=True)
    closing_time = models.TimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True, blank=True, null=True)

    class Meta:
        db_table = 'outlets'

    def __str__(self):
        return self.outlet_name

class OutletStock(models.Model):
    stock_id = models.AutoField(primary_key=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    current_quantity = models.IntegerField(default=0)
    minimum_stock_level = models.IntegerField(default=10, blank=True, null=True)
    last_updated = models.DateTimeField(default=timezone.now, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'outlet_stock'
        unique_together = (('outlet', 'batch'),)

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    nic = models.CharField(unique=True, max_length=20)
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    hire_date = models.DateField()
    employment_status = models.CharField(max_length=20, choices=EmploymentStatus.choices, default=EmploymentStatus.ACTIVE)
    outlet = models.ForeignKey(Outlet, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = 'employees'

class Customer(models.Model):
    customer_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    loyalty_points = models.IntegerField(default=0, blank=True, null=True)

    class Meta:
        db_table = 'customers'

class CustomerOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    order_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    pickup_date = models.DateField()
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    special_instructions = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'customer_orders'

class CustomerOrderItem(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'customer_order_items'

class Sale(models.Model):
    sale_id = models.AutoField(primary_key=True)
    bill_no = models.CharField(max_length=50, unique=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, blank=True, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    sale_date = models.DateTimeField(default=timezone.now, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True, null=True)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=SaleStatus.choices, default=SaleStatus.COMPLETED)

    class Meta:
        db_table = 'sales'

class SaleItem(models.Model):
    sale_item_id = models.AutoField(primary_key=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'sale_items'

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, blank=True, null=True)
    customer_order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    reference_no = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateTimeField(default=timezone.now, blank=True, null=True)

    class Meta:
        db_table = 'payments'

class Wastage(models.Model):
    wastage_id = models.AutoField(primary_key=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=50, choices=WastageReason.choices)
    recorded_by_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, blank=True, null=True)
    recorded_at = models.DateTimeField(default=timezone.now, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'wastage'