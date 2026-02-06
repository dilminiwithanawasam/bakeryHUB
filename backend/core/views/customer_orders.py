from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from core.permissions import IsCustomer
from core.serializers import CustomerOrderSerializer, CustomerOrderCreateSerializer, OutletSerializer
from core.models import CustomerOrder, CustomerOrderItem, Product, Outlet, Customer, User, RoleType
from django.shortcuts import get_object_or_404
from django.db import transaction


class CustomerOrderView(APIView):
    # GET: customer only, POST: public (allows inline customer signup while placing order)
    def get_permissions(self):
        # Per-method permissions: GET requires authenticated customer, POST allows anyone (with guest account creation supported)
        if self.request.method == 'GET':
            return [IsAuthenticated(), IsCustomer()]
        return [AllowAny()]

    def get(self, request):
        # Return orders for the current customer
        try:
            customer = request.user.customer_profile
        except Customer.DoesNotExist:
            return Response({'error': 'Customer profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        orders = CustomerOrder.objects.filter(customer=customer).order_by('-order_date')
        serializer = CustomerOrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Allow unauthenticated users to create an account while placing an order.
        serializer = CustomerOrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        items = data['items']

        # Determine or create the customer
        if request.user and request.user.is_authenticated and hasattr(request.user, 'customer_profile'):
            customer = request.user.customer_profile
        else:
            # Expect optional account data in request to create customer account
            acct = request.data.get('account') or {}
            username = acct.get('username')
            password = acct.get('password')
            email = acct.get('email')
            first_name = acct.get('first_name')
            last_name = acct.get('last_name')

            if not username or not password:
                return Response({'error': 'For guest orders you must provide account.username and account.password (and optionally email/name) to create your customer account'}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists. Please login or choose another username.'}, status=status.HTTP_400_BAD_REQUEST)

            # create user as a Customer
            try:
                with transaction.atomic():
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                        first_name=first_name,
                        last_name=last_name,
                        role=RoleType.CUSTOMER
                    )
                    Customer.objects.create(user=user, address='')
                    customer = user.customer_profile
            except Exception as e:
                return Response({'error': f'Failed to create customer account: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Determine outlet (optional)
        outlet_instance = None
        if 'outlet' in data and data['outlet']:
            try:
                outlet_instance = Outlet.objects.get(pk=data['outlet'])
            except Outlet.DoesNotExist:
                return Response({'error': 'Outlet not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            outlet_instance = Outlet.objects.first()
            if outlet_instance is None:
                return Response({'error': 'No outlet configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create order and items inside a transaction
        try:
            with transaction.atomic():
                total_amount = 0
                # rough compute total
                for it in items:
                    prod = get_object_or_404(Product, pk=it['product_id'])
                    qty = int(it['quantity'])
                    price = float(it.get('unit_price', prod.base_price))
                    total_amount += price * qty

                order = CustomerOrder.objects.create(
                    customer=customer,
                    outlet=outlet_instance,
                    pickup_date=data['pickup_date'],
                    total_amount=total_amount,
                    special_instructions=data.get('special_instructions', '')
                )

                for it in items:
                    prod = get_object_or_404(Product, pk=it['product_id'])
                    qty = int(it['quantity'])
                    price = float(it.get('unit_price', prod.base_price))
                    CustomerOrderItem.objects.create(
                        order=order,
                        product=prod,
                        quantity=qty,
                        unit_price=price
                    )

                out = CustomerOrderSerializer(order).data
                return Response(out, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OutletListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        outlets = Outlet.objects.all()
        serializer = OutletSerializer(outlets, many=True)
        return Response(serializer.data)
