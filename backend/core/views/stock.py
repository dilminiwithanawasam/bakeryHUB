from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.services import InventoryService
from core.serializers import OutletStockSerializer

class OutletStockView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, outlet_id):
        stocks = InventoryService.get_stock_for_outlet(outlet_id)
        serializer = OutletStockSerializer(stocks, many=True)
        return Response(serializer.data)