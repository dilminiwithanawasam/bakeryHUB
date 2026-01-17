from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from core.serializers import BatchCreateSerializer
from core.models import CustomerOrder, Batch
from django.utils import timezone


class BatchCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BatchCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Batch Created Successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FactoryStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        pending = CustomerOrder.objects.filter(status='PENDING').count()
        produced_today = Batch.objects.filter(manufactured_date=today).count()

        return Response({
            "pendingCustomerOrders": pending,
            "batchesProduced": produced_today,
            "dispatchedOrders": 0,
            "recentActivity": []
        })