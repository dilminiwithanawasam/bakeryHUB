from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# ==========================================
# 1. ENUMS (Choices)
# ==========================================
class RoleType(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    OWNER = 'OWNER', 'Owner'
    MANAGER = 'MANAGER', 'Manager'
    FACTORY_MANAGER = 'FACTORY_MANAGER', 'Factory Manager'
    SALESPERSON = 'SALESPERSON', 'Salesperson'
    CUSTOMER = 'CUSTOMER', 'Customer'

class OrderStatus(models.TextChoices):
    PENDING = 'PENDING', 'Pending'
    PREPARING = 'PREPARING', 'Preparing'
    READY_FOR_PICKUP = 'READY_FOR_PICKUP', 'Ready for Pickup'
    COMPLETED = 'COMPLETED', 'Completed'
    CANCELLED = 'CANCELLED', 'Cancelled'
    DISPATCHED = 'DISPATCHED', 'Dispatched'

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

class SaleStatus(models.TextChoices):
    COMPLETED = 'COMPLETED', 'Completed'
    REFUNDED = 'REFUNDED', 'Refunded'

class WastageReason(models.TextChoices):
    EXPIRED_AUTOMATIC = 'EXPIRED_AUTOMATIC', 'Expired Automatic'
    DAMAGED_IN_STORE = 'DAMAGED_IN_STORE', 'Damaged in Store'
    PRODUCTION_FAILURE = 'PRODUCTION_FAILURE', 'Production Failure'
    OTHER = 'OTHER', 'Other'

# ==========================================
# 2. AUTHENTICATION MODELS
# ==========================================
class User(AbstractUser):
    role = models.CharField(
        max_length=50,
        choices=RoleType.choices,
        default=RoleType.CUSTOMER
    )

    # Legacy field kept for backward compatibility; prefer contact_number
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'users'

    @property
    def is_employee(self):
        return self.role in [RoleType.ADMIN, RoleType.OWNER, RoleType.MANAGER, RoleType.FACTORY_MANAGER, RoleType.SALESPERSON]

    @property
    def is_admin(self):
        return self.role == RoleType.ADMIN

    @property
    def is_customer(self):
        return self.role == RoleType.CUSTOMER

    # Note: Do NOT declare @property for `is_staff` or `is_superuser` here.
    # Those names are already model fields on AbstractUser; overriding them
    # with properties prevents Django from assigning boolean values and
    # breaks user creation. The DB fields will be kept in sync in `save()` below.

    def save(self, *args, **kwargs):
        # Keep DB fields `is_staff` and `is_superuser` in sync with `role`.
        try:
            self.is_staff = (self.role == RoleType.ADMIN)
            self.is_superuser = (self.role == RoleType.ADMIN)
        except Exception:
            # During some migration operations these attributes may not be
            # available; ignore and continue so migrations don't fail.
            pass

        super().save(*args, **kwargs)

    @property
    def contact(self):
        """Return the preferred contact number (new field falling back to legacy phone_number)."""
        return self.contact_number or self.phone_number

    def __str__(self):
        return f"{self.username} ({self.role})"

# ==========================================
# 3. CORE BUSINESS MODELS (Shops & Products)
# ==========================================
class Outlet(models.Model):
    outlet_id = models.AutoField(primary_key=True)
    outlet_name = models.CharField(max_length=100)
    location = models.TextField()
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'outlets'

    def __str__(self):
        return self.outlet_name

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    shelf_life_days = models.IntegerField(default=7)
    measurement_type = models.CharField(max_length=20, choices=MeasurementType.choices)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'products'

    def __str__(self):
        return self.product_name

class Batch(models.Model):
    batch_id = models.AutoField(primary_key=True)
    batch_no = models.CharField(max_length=50, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_produced = models.IntegerField()
    manufactured_date = models.DateField(default=timezone.now)
    expiry_date = models.DateField()

    class Meta:
        db_table = 'batches'

class OutletStock(models.Model):
    stock_id = models.AutoField(primary_key=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    current_quantity = models.IntegerField(default=0)
    last_updated = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'outlet_stock'

# ==========================================
# 4. PROFILES (Employees & Customers)
# ==========================================
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    nic = models.CharField(max_length=20, unique=True)
    hire_date = models.DateField(default=timezone.now)
    outlet = models.ForeignKey(Outlet, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = 'employees'

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    address = models.TextField(blank=True, null=True)
    loyalty_points = models.IntegerField(default=0)

    class Meta:
        db_table = 'customers'

# ==========================================
# 5. ORDERS (The Missing Part!)
# ==========================================
class CustomerOrder(models.Model):
    order_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    order_date = models.DateTimeField(default=timezone.now)
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

# ==========================================
# 6. SALES & WASTAGE
# ==========================================
class Sale(models.Model):
    sale_id = models.AutoField(primary_key=True)
    bill_no = models.CharField(max_length=50, unique=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, blank=True, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    sale_date = models.DateTimeField(default=timezone.now)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
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
    payment_date = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'payments'

class Wastage(models.Model):
    wastage_id = models.AutoField(primary_key=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=50, choices=WastageReason.choices)
    recorded_by_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, blank=True, null=True)
    recorded_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'wastage'