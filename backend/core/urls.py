from django.urls import path
from django.http import HttpResponse
from .views import (
    ProductListView,
    OutletStockView,
    LoginView,
    BatchCreateView,
    FactoryStatsView
)

urlpatterns = [
    # Auth
    path('auth/login', LoginView.as_view(), name='login'),

    # Products (Add & List)
    path('products', ProductListView.as_view(), name='product-list'),
    path('products/add', ProductListView.as_view(), name='product-add'),

    # Factory / Batches
    path('factory/create-batch', BatchCreateView.as_view(), name='create-batch'),
    path('factory/stats', FactoryStatsView.as_view(), name='factory-stats'),

    # Stock
    path('stock/<int:outlet_id>/', OutletStockView.as_view(), name='outlet-stock'),
]