from django.utils import timezone
from .models import OutletStock, Product


class InventoryService:
    @staticmethod
    def get_stock_for_outlet(outlet_id):
        """
        Business Logic:
        1. Fetch stock for a specific outlet.
        2. Filter out items with 0 quantity.
        3. Sort by Expiry Date (FIFO logic).
        """
        stocks = OutletStock.objects.filter(
            outlet_id=outlet_id,
            current_quantity__gt=0  # Only show available stock
        ).select_related('batch', 'batch__product').order_by('batch__expiry_date')

        return stocks

    @staticmethod
    def list_all_products():
        """
        Simple logic to get active products only.
        """
        return Product.objects.filter(is_active=True)