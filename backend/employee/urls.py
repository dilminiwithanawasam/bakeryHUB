from django.urls import path
from . import views

urlpatterns = [
    path('', views.EmployeeIndexView.as_view(), name='employee-index'),
    path('manager/', views.ManagerDashboardView.as_view(), name='manager-dashboard'),
    path('factory/', views.FactoryManagerDashboardView.as_view(), name='factory-dashboard'),
    path('sales/', views.SalespersonDashboardView.as_view(), name='sales-dashboard'),

    # Actions
    path('orders/<int:order_id>/update-status/', views.update_order_status, name='update-order-status'),
    path('orders/<int:order_id>/mark-received/', views.mark_order_received, name='mark-order-received'),
]
