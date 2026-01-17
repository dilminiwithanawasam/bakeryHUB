from django.urls import path
# Import from the new separate files
from core.views.auth import LoginView, EmployeeRegisterView
from core.views.products import ProductListView
from core.views.factory import BatchCreateView, FactoryStatsView
from core.views.stock import OutletStockView

urlpatterns = [
    # --- Auth ---
    path('auth/login', LoginView.as_view(), name='login'),
    path('auth/register-employee', EmployeeRegisterView.as_view(), name='register-employee'),

    # --- Products ---
    path('products', ProductListView.as_view(), name='product-list'),
    path('products/add', ProductListView.as_view(), name='product-add'),

    # --- Factory ---
    path('factory/create-batch', BatchCreateView.as_view(), name='create-batch'),
    path('factory/stats', FactoryStatsView.as_view(), name='factory-stats'),

    # --- Stock ---
    path('stock/<int:outlet_id>/', OutletStockView.as_view(), name='outlet-stock'),
]