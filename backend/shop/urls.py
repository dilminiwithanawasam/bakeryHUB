from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    path('', views.ShopHomeView.as_view(), name='home'),
    path('product/<int:product_id>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('cart/add/', views.CartAddView.as_view(), name='cart-add'),
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/remove/', views.CartRemoveView.as_view(), name='cart-remove'),
    path('checkout/', views.ServerCheckoutView.as_view(), name='checkout'),
    path('signup/', views.CustomerSignupView.as_view(), name='signup'),
    path('login/', views.CustomerLoginView.as_view(), name='login'),
    path('dashboard/', views.CustomerDashboardView.as_view(), name='dashboard'),
    path('logout/', views.customer_logout, name='logout'),
]
