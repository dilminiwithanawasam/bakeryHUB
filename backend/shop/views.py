from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

from core.services import InventoryService
from core.models import Product, CustomerOrder
from core.models import RoleType, Customer
from django.db import transaction
from core.models import User

phone_validator = RegexValidator(regex=r'^\+?\d{7,15}$', message='Enter a valid contact number (7-15 digits, optional leading +)')


class ShopHomeView(View):
    def get(self, request):
        q = request.GET.get('q')
        category = request.GET.get('category')

        products = InventoryService.list_all_products()
        if category:
            products = products.filter(category__iexact=category)
        if q:
            products = products.filter(product_name__icontains=q)

        context = {'products': products}
        return render(request, 'shop/home.html', context)


class ProductDetailView(View):
    def get(self, request, product_id):
        product = get_object_or_404(Product, pk=product_id)
        return render(request, 'shop/product_detail.html', {'product': product})


class CustomerSignupView(View):
    def get(self, request):
        return render(request, 'shop/signup.html')

    def post(self, request):
        data = request.POST
        username = data.get('username')
        password = data.get('password')
        password2 = data.get('password2')
        email = data.get('email')
        contact = data.get('contact_number')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        # Basic checks
        if not username or not password or not password2 or not contact:
            messages.error(request, 'Please fill required fields (username, password, contact)')
            return redirect('shop:signup')

        if password != password2:
            messages.error(request, 'Passwords do not match')
            return redirect('shop:signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already taken')
            return redirect('shop:signup')

        if email and User.objects.filter(email=email).exists():
            messages.error(request, 'Email already in use')
            return redirect('shop:signup')

        if User.objects.filter(contact_number=contact).exists() or User.objects.filter(phone_number=contact).exists():
            messages.error(request, 'Contact number already in use')
            return redirect('shop:signup')

        # Validate contact format
        try:
            phone_validator(contact)
        except ValidationError as e:
            messages.error(request, str(e.message))
            return redirect('shop:signup')

        # Strong password validation
        try:
            validate_password(password)
        except ValidationError as e:
            messages.error(request, '; '.join(e.messages))
            return redirect('shop:signup')

        try:
            with transaction.atomic():
                user = User.objects.create_user(username=username, email=email, password=password, role=RoleType.CUSTOMER, contact_number=contact, first_name=first_name, last_name=last_name)
                Customer.objects.create(user=user, address='')
                login(request, user)
                messages.success(request, 'Account created and logged in')
                return redirect('shop:dashboard')
        except Exception as err:
            messages.error(request, f'Failed to create account: {err}')
            return redirect('shop:signup')


class CustomerLoginView(View):
    def get(self, request):
        return render(request, 'shop/login.html')

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is None:
            messages.error(request, 'Invalid credentials')
            return redirect('shop:login')
        if user.role != RoleType.CUSTOMER:
            messages.error(request, 'Use the employee portal to login' )
            return redirect('shop:login')
        login(request, user)
        return redirect('shop:dashboard')


@login_required
def customer_logout(request):
    logout(request)
    messages.info(request, 'Logged out')
    return redirect('shop:home')


@method_decorator(login_required, name='dispatch')
class CustomerDashboardView(View):
    def get(self, request):
        user = request.user
        if user.role != RoleType.CUSTOMER:
            return redirect('shop:login')
        try:
            customer = user.customer_profile
        except Customer.DoesNotExist:
            messages.error(request, 'Customer profile not found')
            return redirect('shop:home')

        orders = CustomerOrder.objects.filter(customer=customer).order_by('-order_date')
        return render(request, 'shop/dashboard.html', {'orders': orders})


# --- Session Cart & Server-side Checkout ---
class CartAddView(View):
    def post(self, request):
        product_id = int(request.POST.get('product_id'))
        qty = int(request.POST.get('qty', 1))
        cart = request.session.get('cart', {})
        cart[str(product_id)] = cart.get(str(product_id), 0) + qty
        request.session['cart'] = cart
        return redirect(request.META.get('HTTP_REFERER', 'shop:home'))


class CartView(View):
    def get(self, request):
        cart = request.session.get('cart', {})
        product_ids = [int(k) for k in cart.keys()]
        products = Product.objects.filter(product_id__in=product_ids)
        items = []
        for p in products:
            items.append({'product': p, 'qty': cart.get(str(p.product_id), 0)})
        return render(request, 'shop/cart.html', {'items': items})


class CartRemoveView(View):
    def post(self, request):
        product_id = request.POST.get('product_id')
        cart = request.session.get('cart', {})
        if product_id in cart:
            del cart[product_id]
        request.session['cart'] = cart
        return redirect('shop:cart')


class ServerCheckoutView(View):
    def get(self, request):
        cart = request.session.get('cart', {})
        if not cart:
            messages.error(request, 'Cart is empty')
            return redirect('shop:home')
        product_ids = [int(k) for k in cart.keys()]
        products = Product.objects.filter(product_id__in=product_ids)
        items = []
        subtotal = 0
        for p in products:
            qty = cart.get(str(p.product_id), 0)
            items.append({'product': p, 'qty': qty})
            subtotal += float(p.base_price) * qty
        outlets = InventoryService.get_outlets() if hasattr(InventoryService, 'get_outlets') else []
        return render(request, 'shop/checkout.html', {'items': items, 'subtotal': subtotal, 'outlets': outlets})

    def post(self, request):
        # Build payload compatible with API
        cart = request.session.get('cart', {})
        if not cart:
            messages.error(request, 'Cart is empty')
            return redirect('shop:home')

        items = []
        for pid, qty in cart.items():
            items.append({'product_id': int(pid), 'quantity': int(qty), 'unit_price': 0})

        pickup_date = request.POST.get('pickup_date')
        outlet = request.POST.get('outlet')

        payload = {'pickup_date': pickup_date, 'items': items}
        if outlet: payload['outlet'] = int(outlet)

        # If not logged in, attempt to create an account if account data provided
        if not request.user.is_authenticated and request.POST.get('username'):
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            try:
                user = User.objects.create_user(username=username, email=email, password=password, role=RoleType.CUSTOMER)
                Customer.objects.create(user=user, address='')
                login(request, user)
            except Exception as e:
                messages.error(request, f'Could not create account: {e}')
                return redirect('shop:checkout')

        # Delegate to backend API view (reuse CustomerOrderView)
        from core.views.customer_orders import CustomerOrderView
        view = CustomerOrderView.as_view()
        # Build a fake request to pass through DRF view is heavy; instead call serializer and create directly
        try:
            # Compute subtotal
            subtotal = 0
            for it in items:
                prod = Product.objects.get(product_id=it['product_id'])
                subtotal += float(prod.base_price) * int(it['quantity'])

            # Create CustomerOrder directly
            customer = None
            if request.user.is_authenticated and hasattr(request.user, 'customer_profile'):
                customer = request.user.customer_profile
            else:
                messages.error(request, 'Please login or supply account details')
                return redirect('shop:checkout')

            outlet_obj = None
            if outlet:
                from core.models import Outlet
                outlet_obj = Outlet.objects.filter(outlet_id=int(outlet)).first()
            else:
                outlet_obj = Outlet.objects.first()

            order = CustomerOrder.objects.create(customer=customer, outlet=outlet_obj, pickup_date=pickup_date, total_amount=subtotal)
            for it in items:
                prod = Product.objects.get(product_id=it['product_id'])
                from core.models import CustomerOrderItem
                CustomerOrderItem.objects.create(order=order, product=prod, quantity=it['quantity'], unit_price=prod.base_price)

            # Clear cart
            request.session['cart'] = {}
            return render(request, 'shop/confirmation.html', {'order': order})
        except Exception as e:
            messages.error(request, f'Failed to place order: {e}')
            return redirect('shop:checkout')