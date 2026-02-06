from django.urls import path, include
from django.views.decorators.http import require_POST, require_GET
# Import from the new separate files
from core.views.auth import LoginView, EmployeeCreateView, CustomerRegisterView
from core.views.products import ProductListView, ProductDetailView
from core.views.factory import BatchCreateView, FactoryStatsView
from core.views.customer_orders import CustomerOrderView, OutletListView
from core.views.pos import POSPageView, POSProductSearchAPI, POSCompleteOrderAPI, POSCategoryListAPI
from core.views.admin_users import AdminUserList, AdminUserDetail, AdminEmployeeList, AdminEmployeeDetail


urlpatterns = [
    # --- Auth ---
    # FIXED: Added slash at the end
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/customer/', CustomerRegisterView.as_view(), name='customer-register'),
    path('auth/register/employee/', EmployeeCreateView.as_view(), name='employee-create'),

    # Products
    path('products/', ProductListView.as_view(), name='products'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Customer Orders & Outlets
    path('customer/orders/', CustomerOrderView.as_view(), name='customer-orders'),
    path('outlets/', OutletListView.as_view(), name='outlets'),

    # Factory
    path('factory/create-batch/', BatchCreateView.as_view(), name='create-batch'),
    path('factory/stats/', FactoryStatsView.as_view(), name='factory-stats'),

    # POS SYSTEM (SALESPERSON ONLY)
    path('pos/dashboard/', POSPageView.as_view(), name='pos-dashboard'),
    path('pos/search/', POSProductSearchAPI.as_view(), name='pos-search'),
    path('pos/categories/', POSCategoryListAPI.as_view(), name='pos-categories'),
    path('pos/complete-sale/', POSCompleteOrderAPI.as_view(), name='pos-complete-sale'),

    # --- Admin User Management ---
    path('admin/users/', AdminUserList.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', AdminUserDetail.as_view(), name='admin-user-detail'),
    path('admin/employees/', AdminEmployeeList.as_view(), name='admin-employees'),
    path('admin/employees/<int:pk>/', AdminEmployeeDetail.as_view(), name='admin-employee-detail'),
]
