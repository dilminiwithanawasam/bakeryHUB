# Django Settings Configuration for POS System

## Required Settings

Add these to your `backend/bakeryhub/settings.py` file:

---

## 1. INSTALLED_APPS

Ensure these apps are in INSTALLED_APPS:

```python
INSTALLED_APPS = [
    'daphne',  # For WebSocket support (optional)
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
    
    # Your apps
    'core.apps.CoreConfig',
    'employee.apps.EmployeeConfig',
    'shop.apps.ShopConfig',
]
```

---

## 2. Authentication & Permissions

```python
# Authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',  # Default
]

# REST Framework authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}
```

---

## 3. Middleware

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Before CommonMiddleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # CRITICAL for POS
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

---

## 4. CSRF Configuration

```python
# CSRF Protection (required for POS form submissions)
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000',
    # Add your production domain here
]

CSRF_COOKIE_SECURE = False  # True in production
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_SECURE = False  # True in production
```

---

## 5. CORS Configuration

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8000',
]

CORS_ALLOW_CREDENTIALS = True
```

---

## 6. Static Files (POS CSS/JS)

```python
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
```

---

## 7. Templates

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(BASE_DIR, 'core', 'templates'),
            os.path.join(BASE_DIR, 'employee', 'templates'),
            os.path.join(BASE_DIR, 'shop', 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

---

## 8. Database

```python
# SQLite (development)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# PostgreSQL (production) - uncomment and configure for production
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'bakeryhub',
#         'USER': 'postgres',
#         'PASSWORD': 'your_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }
```

---

## 9. Logging (Optional but useful for debugging)

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'debug.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'core.views': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

---

## 10. Time Zone (Important for bill timestamps)

```python
USE_TZ = True
TIME_ZONE = 'Asia/Colombo'  # Change to your timezone
```

---

## 11. Session Configuration

```python
# Session timeout (30 minutes for POS)
SESSION_COOKIE_AGE = 1800

# Session save on every request (optional)
SESSION_SAVE_EVERY_REQUEST = True
```

---

## Prerequisites & Dependencies

### Python Packages Required

```bash
pip install django>=4.2
pip install djangorestframework>=3.14
pip install django-cors-headers>=4.0
pip install django-filter>=23.0
pip install psycopg2-binary  # For PostgreSQL (production)
pip install gunicorn  # For production server
```

### Installation

```bash
# In your project root
pip install -r requirements.txt
```

---

## Django Management Commands

### 1. Create Migrations (after adding POS views)

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Create Superuser (Django admin)

```bash
python manage.py createsuperuser
# Enter username, email, password
```

### 3. Create SALESPERSON User

```bash
python manage.py shell

from django.contrib.auth import get_user_model
from core.models import Employee, Outlet, RoleType

User = get_user_model()

# Get or create outlet
outlet = Outlet.objects.first()  # or create: Outlet.objects.create(outlet_name="...", location="...")

# Create user
user = User.objects.create_user(
    username='salesperson1',
    email='sale@bakery.com',
    password='secure_password123',
    role=RoleType.SALESPERSON
)

# Create employee profile
employee = Employee.objects.create(
    user=user,
    outlet=outlet
)

print(f"Created: {user.username} ({user.role}) at {outlet.outlet_name}")
```

### 4. Generate API Token

```bash
python manage.py shell

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()
user = User.objects.get(username='salesperson1')

# Create or get token
token, created = Token.objects.get_or_create(user=user)
print(f"Token: {token.key}")
# Save this token - frontend will send it in Authorization header
```

### 5. Load Sample Products

```bash
python manage.py shell

from core.models import Product, Category

# Create categories
bread, _ = Category.objects.get_or_create(category_name="Bread")
cake, _ = Category.objects.get_or_create(category_name="Cake")
pastry, _ = Category.objects.get_or_create(category_name="Pastries")

# Create products
products = [
    ("Butter Loaf", bread, 150.00),
    ("White Bread", bread, 120.00),
    ("Chocolate Cake", cake, 280.00),
    ("Vanilla Cupcake", pastry, 45.00),
]

for name, category, price in products:
    Product.objects.get_or_create(
        product_name=name,
        defaults={
            'category': category,
            'base_price': price,
            'is_active': True
        }
    )

print("Products created successfully")
```

### 6. Create Batches for Products

```bash
python manage.py shell

from core.models import Product, Batch, Outlet
from datetime import datetime, timedelta

outlet = Outlet.objects.first()

for product in Product.objects.filter(is_active=True):
    batch = Batch.objects.create(
        product=product,
        batch_date=datetime.now(),
        expiry_date=datetime.now() + timedelta(days=7),
        quantity_produced=100,
    )
    
    # Link to outlet stock
    from core.models import OutletStock
    OutletStock.objects.get_or_create(
        outlet=outlet,
        batch=batch,
        defaults={'current_quantity': 100}
    )

print("Batches created")
```

---

## Testing the POS System

### 1. Start Django Server

```bash
python manage.py runserver 0.0.0.0:8000
```

### 2. Login as SALESPERSON

```
URL: http://localhost:8000/api/auth/login/
Method: POST
Body: {
    "username": "salesperson1",
    "password": "secure_password123"
}
Response: {
    "token": "abc123xyz...",
    "user_id": 2,
    "role": "SALESPERSON"
}
```

### 3. Access POS Dashboard

```
URL: http://localhost:8000/pos/dashboard/
Auth: Browser session (after login)
Result: Single-page POS template loads
```

### 4. Test API Search

```bash
curl http://localhost:8000/api/pos/search/?search=bread \
  -H "Authorization: Token abc123xyz..."
```

### 5. Test Complete Sale

```bash
curl -X POST http://localhost:8000/api/pos/complete-sale/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Token abc123xyz..." \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2, "unit_price": 150.00}
    ],
    "discount_amount": 0,
    "payment_method": "CASH",
    "tendered_amount": 350.00
  }'
```

---

## Production Deployment Checklist

- [ ] Set `DEBUG = False` in settings.py
- [ ] Update `ALLOWED_HOSTS` with production domain
- [ ] Set `CSRF_COOKIE_SECURE = True`
- [ ] Set `SESSION_COOKIE_SECURE = True`
- [ ] Update database to PostgreSQL
- [ ] Configure static file serving (whitenoise or nginx)
- [ ] Set up HTTPS
- [ ] Configure gunicorn/uWSGI
- [ ] Set `SECRET_KEY` from environment variable
- [ ] Run `collectstatic`: `python manage.py collectstatic`
- [ ] Test all endpoints with valid tokens
- [ ] Set up error logging and monitoring

---

## Environment Variables (Create `.env` file)

```bash
# Django
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=bakeryhub
DB_USER=postgres
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## Common Issues & Solutions

### Issue: "CSRF token missing"

**Solution:**
```python
# In settings.py - ensure CSRF middleware is present
# In template - include {% csrf_token %}
# In JavaScript - include CSRF token in headers

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
fetch('/api/pos/complete-sale/', {
    method: 'POST',
    headers: {
        'X-CSRFToken': csrftoken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
});
```

### Issue: "401 Unauthorized"

**Solution:**
```python
# Ensure token is sent in Authorization header
Authorization: Token abc123xyz...

# Or generate new token
from rest_framework.authtoken.models import Token
Token.objects.filter(user__username='salesperson1').delete()
token = Token.objects.create(user=user)
```

### Issue: "404 Not Found on /pos/dashboard/"

**Solution:**
```python
# Ensure core/urls.py is included in main urls.py
# In backend/bakeryhub/urls.py, add:
path('api/', include('core.urls')),
path('', include('employee.urls')),
```

### Issue: Template directory not found

**Solution:**
```python
# In settings.py, ensure TEMPLATES DIRS includes:
os.path.join(BASE_DIR, 'employee', 'templates'),
# And template file is at: employee/templates/employee/pos.html
```

---

**Last Updated:** 2026-02-06
**Status:** Ready for Production Setup
