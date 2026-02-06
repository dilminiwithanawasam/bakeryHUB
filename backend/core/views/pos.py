# FILE: backend/core/views/pos.py
# Professional POS Dashboard for Salesperson role
# - Fast product loading with optimized queries
# - AJAX-based cart management
# - Single-page operation for speed
# - Minimal page reloads

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.db import transaction
from django.utils import timezone
from django.views import View
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from core.models import (
    Product, Batch, OutletStock, Sale, SaleItem, 
    Payment, Employee, RoleType, PaymentMethod, PaymentStatus
)
from core.permissions import IsSalesperson
import json


# ==========================================
# POS LANDING PAGE (Django Template Render)
# ==========================================
class POSPageView(View):
    """
    Renders the POS dashboard as a Django template.
    Access control: SALESPERSON role only
    """
    
    @method_decorator(login_required)
    def get(self, request):
        # Check role
        if request.user.role != RoleType.SALESPERSON:
            return redirect('login')  # or render permission denied
        
        # Get employee profile (includes outlet)
        try:
            employee = request.user.employee_profile
            outlet = employee.outlet
        except:
            return redirect('login')
        
        # Fetch all active products with smart query optimization
        products = Product.objects.filter(is_active=True).select_related().values(
            'product_id', 'product_name', 'category', 'base_price'
        )
        
        # Group products by category
        categories = {}
        for product in products:
            cat = product.get('category', 'Uncategorized')
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(product)
        
        context = {
            'user': request.user,
            'employee': employee,
            'outlet': outlet,
            'categories': categories,
            'all_products': list(products),
        }
        
        return render(request, 'employee/pos.html', context)


# ==========================================
# POS API ENDPOINTS (REST Framework)
# ==========================================
class POSProductSearchAPI(APIView):
    """
    Search products by name/SKU
    Query params: ?search=butter&category=Bread
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Verify SALESPERSON role
        if request.user.role != RoleType.SALESPERSON:
            return Response(
                {'error': 'Access denied. Salesperson role required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        search = request.query_params.get('search', '').strip()
        category = request.query_params.get('category', '').strip()
        
        # Base query
        queryset = Product.objects.filter(is_active=True)
        
        # Filter by category if provided
        if category:
            queryset = queryset.filter(category=category)
        
        # Search by name
        if search:
            queryset = queryset.filter(product_name__icontains=search)
        
        # Return minimal data for performance
        products = queryset.values(
            'product_id', 'product_name', 'category', 'base_price'
        )[:50]  # Limit to 50 for safety
        
        return Response({
            'results': list(products),
            'count': queryset.count()
        })


class POSCompleteOrderAPI(APIView):
    """
    Complete a sale from the POS.
    
    Expected POST data:
    {
        "items": [
            {"product_id": 1, "quantity": 2, "unit_price": 150.00},
            {"product_id": 2, "quantity": 1, "unit_price": 280.00}
        ],
        "discount_amount": 0,
        "payment_method": "CASH",
        "tendered_amount": 700.00
    }
    
    Returns: sale_id, bill_no, total_amount, change
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Access control
        if request.user.role != RoleType.SALESPERSON:
            return Response(
                {'error': 'Access denied. Salesperson role required.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get employee and outlet
        try:
            employee = request.user.employee_profile
            outlet = employee.outlet
        except:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not outlet:
            return Response(
                {'error': 'Employee not assigned to any outlet'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse request
        items = request.data.get('items', [])
        discount_amount = float(request.data.get('discount_amount', 0))
        payment_method = request.data.get('payment_method', 'CASH')
        tendered_amount = float(request.data.get('tendered_amount', 0))
        
        if not items:
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if payment_method not in [method[0] for method in PaymentMethod.choices]:
            return Response(
                {'error': 'Invalid payment method'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate totals
        subtotal = 0
        sale_items_data = []
        
        # Validate and prepare items
        for item in items:
            try:
                product = Product.objects.get(product_id=item['product_id'])
                quantity = int(item['quantity'])
                unit_price = float(item['unit_price'])
                subtotal += unit_price * quantity
                
                sale_items_data.append({
                    'product': product,
                    'quantity': quantity,
                    'unit_price': unit_price,
                    'subtotal': unit_price * quantity
                })
            except Product.DoesNotExist:
                return Response(
                    {'error': f"Product {item['product_id']} not found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except (ValueError, KeyError) as e:
                return Response(
                    {'error': f'Invalid item data: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Validate discount
        if discount_amount < 0 or discount_amount > subtotal:
            return Response(
                {'error': 'Invalid discount amount'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        net_amount = subtotal - discount_amount
        change_amount = max(0, tendered_amount - net_amount)
        
        # Generate bill number
        import uuid
        bill_no = f"BILL-{timezone.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        # Create sale in a transaction
        try:
            with transaction.atomic():
                # Create Sale record
                sale = Sale.objects.create(
                    bill_no=bill_no,
                    outlet=outlet,
                    employee=employee,
                    customer=None,  # POS sales don't track customer
                    total_amount=subtotal,
                    discount_amount=discount_amount,
                    net_amount=net_amount,
                )
                
                # Create SaleItems
                # Note: In a real system, you'd link to Batch for inventory tracking
                # For now, we create from Product directly
                for item_data in sale_items_data:
                    # Try to find latest batch for this product
                    batch = Batch.objects.filter(
                        product=item_data['product']
                    ).order_by('-batch_id').first()
                    
                    if batch:
                        SaleItem.objects.create(
                            sale=sale,
                            batch=batch,
                            quantity=item_data['quantity'],
                            unit_price=item_data['unit_price'],
                            subtotal=item_data['subtotal']
                        )
                
                # Create Payment record
                Payment.objects.create(
                    sale=sale,
                    amount=net_amount,
                    payment_method=payment_method,
                    payment_status=PaymentStatus.SUCCESS,
                    reference_no=bill_no
                )
                
                # Return success response
                return Response({
                    'success': True,
                    'sale_id': sale.sale_id,
                    'bill_no': sale.bill_no,
                    'total_amount': float(sale.total_amount),
                    'discount_amount': float(sale.discount_amount),
                    'net_amount': float(sale.net_amount),
                    'payment_method': payment_method,
                    'tendered_amount': tendered_amount,
                    'change_amount': float(change_amount),
                    'timestamp': sale.sale_date.isoformat()
                }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': f'Failed to complete sale: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class POSCategoryListAPI(APIView):
    """
    Get all product categories for POS filtering
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != RoleType.SALESPERSON:
            return Response(
                {'error': 'Access denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get unique categories from active products
        categories = Product.objects.filter(
            is_active=True
        ).values_list('category', flat=True).distinct()
        
        return Response({
            'categories': sorted(list(set(cat for cat in categories if cat)))
        })
