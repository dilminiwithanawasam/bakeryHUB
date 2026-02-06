from django.test import TestCase, Client
from django.urls import reverse
from core.models import Product, Outlet

class ServerCheckoutFlowTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.product = Product.objects.create(product_name='Server Bread', base_price=100.00, measurement_type='PCS')
        self.outlet = Outlet.objects.create(outlet_name='Main Outlet', location='Street')

    def test_add_to_cart_and_checkout_as_guest_creates_account_and_order(self):
        # Add to session cart
        resp = self.client.post(reverse('shop:cart-add'), {'product_id': self.product.product_id, 'qty': 2}, follow=True)
        self.assertEqual(resp.status_code, 200)
        # Go to cart
        resp = self.client.get(reverse('shop:cart'))
        self.assertContains(resp, 'Server Bread')
        # Checkout (guest) - provide account data
        resp = self.client.post(reverse('shop:checkout'), {
            'pickup_date': '2030-01-01',
            'outlet': self.outlet.outlet_id,
            'username': 'guest1',
            'password': 'StrongPass123!'
        }, follow=True)
        self.assertContains(resp, 'Order Confirmed')

    def test_empty_cart_redirects(self):
        resp = self.client.get(reverse('shop:checkout'), follow=True)
        self.assertContains(resp, 'Cart is empty')
