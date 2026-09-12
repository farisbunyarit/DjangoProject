from decimal import Decimal

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from rest_framework.test import APIClient

from .models import Category, Product, Cart, CartItem


# =========================
# CATEGORY MODEL TESTS
# =========================

class CategoryModelTest(TestCase):

    def test_category_creation(self):

        category = Category.objects.create(
            name="Motorcycles",
            icon="🏍️"
        )

        self.assertEqual(
            category.name,
            "Motorcycles"
        )

        self.assertEqual(
            str(category),
            "Motorcycles"
        )


# =========================
# PRODUCT MODEL TESTS
# =========================

class ProductModelTest(TestCase):

    def setUp(self):

        self.category = Category.objects.create(
            name="Motorcycles",
            icon="🏍️"
        )

    def test_product_creation(self):

        product = Product.objects.create(
            name="Yamaha R1",
            description="Sport motorcycle",
            price=Decimal("15000.00"),
            category=self.category,
            icon="🏍️"
        )

        self.assertEqual(
            product.name,
            "Yamaha R1"
        )

        self.assertEqual(
            product.price,
            Decimal("15000.00")
        )

        self.assertEqual(
            product.category,
            self.category
        )

        self.assertEqual(
            str(product),
            "Yamaha R1"
        )


# =========================
# CART MODEL TESTS
# =========================

class CartModelTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="TestPassword123!"
        )

        self.category = Category.objects.create(
            name="Motorcycles",
            icon="🏍️"
        )

        self.product = Product.objects.create(
            name="Honda CBR",
            description="Sport motorcycle",
            price=Decimal("12000.00"),
            category=self.category
        )

    def test_cart_creation(self):

        cart = Cart.objects.create(
            user=self.user
        )

        self.assertEqual(
            cart.user,
            self.user
        )

    def test_cart_item_creation(self):

        cart = Cart.objects.create(
            user=self.user
        )

        item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2
        )

        self.assertEqual(
            item.quantity,
            2
        )

        self.assertEqual(
            item.product,
            self.product
        )

        self.assertEqual(
            item.cart,
            cart
        )


# =========================
# HOME VIEW TESTS
# =========================

class HomeViewTest(TestCase):

    def test_home_page(self):

        response = self.client.get(
            reverse("home")
        )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertTemplateUsed(
            response,
            "home.html"
        )


# =========================
# AUTHENTICATION TESTS
# =========================

class AuthenticationTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="TestPassword123!"
        )

    def test_login(self):

        login_successful = self.client.login(
            username="testuser",
            password="TestPassword123!"
        )

        self.assertTrue(
            login_successful
        )

    def test_login_redirect_requires_login(self):

        response = self.client.get(
            reverse("login_redirect")
        )

        self.assertEqual(
            response.status_code,
            302
        )


# =========================
# CART VIEW TESTS
# =========================

class CartViewTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="TestPassword123!"
        )

        self.category = Category.objects.create(
            name="Motorcycles",
            icon="🏍️"
        )

        self.product = Product.objects.create(
            name="Kawasaki Ninja",
            description="Sport motorcycle",
            price=Decimal("14000.00"),
            category=self.category
        )

        self.client.login(
            username="testuser",
            password="TestPassword123!"
        )

    def test_add_to_cart(self):

        response = self.client.post(
            reverse("add_to_cart"),
            {
                "product_id": self.product.id,
                "quantity": 2,
            }
        )

        self.assertEqual(
            response.status_code,
            200
        )

        item = CartItem.objects.get(
            product=self.product
        )

        self.assertEqual(
            item.quantity,
            2
        )

    def test_update_cart(self):

        cart = Cart.objects.create(
            user=self.user
        )

        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=2
        )

        response = self.client.post(
            reverse("update_cart"),
            {
                "product_id": self.product.id,
                "quantity": 5,
            }
        )

        self.assertEqual(
            response.status_code,
            200
        )

        item = CartItem.objects.get(
            cart=cart,
            product=self.product
        )

        self.assertEqual(
            item.quantity,
            5
        )

    def test_remove_from_cart(self):

        cart = Cart.objects.create(
            user=self.user
        )

        CartItem.objects.create(
            cart=cart,
            product=self.product,
            quantity=1
        )

        response = self.client.post(
            reverse("remove_from_cart"),
            {
                "product_id": self.product.id
            }
        )

        self.assertEqual(
            response.status_code,
            200
        )

        self.assertFalse(
            CartItem.objects.filter(
                cart=cart,
                product=self.product
            ).exists()
        )


# =========================
# ADMIN ACCESS TESTS
# =========================

class AdminAccessTest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="normaluser",
            password="TestPassword123!"
        )

        self.admin = User.objects.create_user(
            username="admin",
            password="AdminPassword123!",
            is_staff=True
        )

    def test_normal_user_cannot_access_dashboard(self):

        self.client.login(
            username="normaluser",
            password="TestPassword123!"
        )

        response = self.client.get(
            reverse("admin_dashboard")
        )

        self.assertRedirects(
            response,
            reverse("home")
        )

    def test_admin_can_access_dashboard(self):

        self.client.login(
            username="admin",
            password="AdminPassword123!"
        )

        response = self.client.get(
            reverse("admin_dashboard")
        )

        self.assertEqual(
            response.status_code,
            200
        )


# =========================
# PRODUCT API TESTS
# =========================

class ProductAPITest(TestCase):

    def setUp(self):

        self.category = Category.objects.create(
            name="Engine Parts",
            icon="⚙️"
        )

        Product.objects.create(
            name="Oil Filter",
            description="High Flow Oil Filter",
            price=Decimal("25.00"),
            category=self.category,
            icon="⚙️"
        )

    def test_product_api(self):

        response = self.client.get(
            reverse("product_api")
        )

        self.assertEqual(
            response.status_code,
            200
        )

        data = response.json()

        self.assertEqual(
            len(data),
            1
        )

        self.assertEqual(
            data[0]["name"],
            "Oil Filter"
        )


# =========================
# CATEGORY API TESTS
# =========================

class CategoryAPITest(TestCase):

    def setUp(self):

        Category.objects.create(
            name="Brake System",
            icon="🛑"
        )

    def test_category_api(self):

        response = self.client.get(
            reverse("category_api")
        )

        self.assertEqual(
            response.status_code,
            200
        )

        data = response.json()

        self.assertEqual(
            len(data),
            1
        )

        self.assertEqual(
            data[0]["name"],
            "Brake System"
        )


# =========================
# USER API TESTS
# =========================

class UserAPITest(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="TestPassword123!"
        )

        self.admin = User.objects.create_user(
            username="admin",
            password="AdminPassword123!",
            is_staff=True
        )

        self.client = APIClient()

    def test_user_api_requires_authentication(self):

        response = self.client.get(
            reverse("user_api")
        )

        self.assertEqual(
            response.status_code,
            403
        )

    def test_normal_user_cannot_access_user_api(self):

        self.client.force_authenticate(
            user=self.user
        )

        response = self.client.get(
            reverse("user_api")
        )

        self.assertEqual(
            response.status_code,
            403
        )

    def test_user_api_authenticated_admin(self):

        self.client.force_authenticate(
            user=self.admin
        )

        response = self.client.get(
            reverse("user_api")
        )

        self.assertEqual(
            response.status_code,
            200
        )

        data = response.json()

        self.assertEqual(
            len(data),
            2
        )

        self.assertEqual(
            data[0]["username"],
            "admin"
        )

        self.assertTrue(
            data[0]["is_staff"]
        )
