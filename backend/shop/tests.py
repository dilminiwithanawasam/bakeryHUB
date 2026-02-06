from django.test import TestCase, Client
from django.urls import reverse
from core.models import Product

class ShopViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.product = Product.objects.create(product_name='Test Bread', base_price=2000, measurement_type='PCS', category='Bread', description='Tasty')

    def test_home_shows_product(self):
        resp = self.client.get(reverse('shop:home'))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'Test Bread')

    def test_product_detail(self):
        resp = self.client.get(reverse('shop:product-detail', args=[self.product.product_id]))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'Tasty')

    def test_search_filters(self):
        resp = self.client.get(reverse('shop:home') + '?q=Bread')
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'Test Bread')

    def test_category_filter(self):
        resp = self.client.get(reverse('shop:home') + '?category=Bread')
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, 'Test Bread')
