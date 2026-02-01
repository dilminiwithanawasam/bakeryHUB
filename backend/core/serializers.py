from rest_framework import serializers
from .models import Product, Batch, OutletStock


class ProductSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_id',
            'product_name',
            'description',
            'category',
            'base_price',
            'shelf_life_days',
            'measurement_type',
            'is_active'
        ]



from rest_framework import serializers
from core.models import Batch, Product

class BatchCreateSerializer(serializers.ModelSerializer):
    # Map product_id → product (FK)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product'
    )

    # Map frontend names → model names
    batch_code = serializers.CharField(source='batch_no')
    quantity = serializers.IntegerField(source='quantity_produced')
    mfd = serializers.DateField(source='manufactured_date')
    exp = serializers.DateField(source='expiry_date')

    class Meta:
        model = Batch
        fields = [
            'batch_code',
            'product_id',
            'quantity',
            'mfd',
            'exp'
        ]



class BatchSerializer(serializers.ModelSerializer):
    """
    Serializer for VIEWING batches (includes full product details).
    """
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Batch
        fields = ['batch_id', 'batch_no', 'expiry_date', 'quantity_produced', 'product']


class OutletStockSerializer(serializers.ModelSerializer):
    # Flatten data for easier frontend display
    product_name = serializers.CharField(source='batch.product.product_name', read_only=True)
    batch_no = serializers.CharField(source='batch.batch_no', read_only=True)
    price = serializers.DecimalField(source='batch.product.base_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OutletStock
        fields = ['stock_id', 'current_quantity', 'batch', 'product_name', 'batch_no', 'price']