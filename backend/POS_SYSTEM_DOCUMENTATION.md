# BakeryHUB POS (Point of Sale) System - Documentation

## Overview
This is a professional, high-performance POS system built for bakery retail operations.

**Target User:** Salesperson at counter (standing, using keyboard + mouse)
**Priority:** Speed, clarity, minimal clicks
**UI Philosophy:** Professional, neutral colors, no visual clutter

---

## Key Features

### 1. **Single-Screen Operation**
- No page reloads after sales
- Minimal JavaScript (vanilla JS, no React)
- Product grid on left, billing panel on right
- All cart operations via AJAX

### 2. **Fast Product Selection**
- Large product buttons (easy to tap/click)
- Instant search (as you type)
- Category filtering
- Product name + price only (no clutter)

### 3. **Billing Panel**
- Clear item listing with quantities
- Quick quantity adjustment (+/- buttons)
- Real-time total calculation
- Discount input field
- Payment method selector (Cash, Card, Advance)
- Tendered amount input
- Automatic change calculation

### 4. **Payment Workflow**
- Select payment method (Cash/Card/Advance)
- Enter tendered amount
- Review change
- One-click "Complete Sale" button
- Confirmation message shows bill number

### 5. **Database Integration**
- Saves Sale record (bill number, amounts, employee/outlet)
- Creates SaleItem records for inventory tracking
- Creates Payment record for accounting
- Links sale to current employee and outlet

---

## File Structure

```
backend/
├── core/
│   ├── views/
│   │   └── pos.py              # POS views & APIs
│   ├── urls.py                 # POS URL routes
│   └── permissions.py          # IsSalesperson permission
├── employee/
│   └── templates/employee/
│       └── pos.html            # POS dashboard template
└── ...

# Key endpoints:
GET    /pos/dashboard/          # Render POS page (HTML)
GET    /api/pos/search/         # Search products (JSON)
GET    /api/pos/categories/     # Get categories (JSON)
POST   /api/pos/complete-sale/  # Save sale (JSON)
```

---

## Technical Architecture

### Backend (Django)

#### `POSPageView` - Template View
- Renders the single HTML page
- Checks SALESPERSON role
- Passes outlet, user, and products to template
- Groups products by category

#### `POSProductSearchAPI` - REST Endpoint
- Filters products by search term
- Filters by category
- Returns product list (id, name, category, price)
- Limited to 50 results for performance

#### `POSCompleteOrderAPI` - REST Endpoint
- Receives cart items, discount, payment details
- Validates all data
- **Creates atomic transaction:**
  1. Sale record (bill number, totals)
  2. SaleItem records (each product sold)
  3. Payment record (payment method/status)
- Returns: sale_id, bill_no, change_amount
- **Error handling:** Validation or exceptions return 400/500

#### `POSCategoryListAPI` - REST Endpoint
- Returns all product categories
- Used for category filtering

### Frontend (Django Template + Vanilla JS)

#### HTML Structure
- Split layout: 60% product selection, 40% billing
- Responsive grid for products
- Sticky billing panel

#### JavaScript (POSManager Class)
- **init()**: Attach event listeners
- **addToCart()**: Add product to cart object
- **updateQty()**: Change product quantity
- **removeFromCart()**: Remove item from cart
- **updateUI()**: Re-render cart display
- **updateTotals()**: Recalculate totals
- **updateChange()**: Calculate change amount
- **search()**: Filter products by name
- **filterByCategory()**: Show products of selected category
- **completeSale()**: POST to `/api/pos/complete-sale/`
- **showMessage()**: Display alerts to user

#### Cart Data Structure
```javascript
cart = {
    productId: {
        name: "Product Name",
        price: 150.00,
        qty: 2
    },
    ...
}
```

---

## User Flow

### 1. Salesperson Login
```
User logs in with SALESPERSON role
→ Dashboard loads `/pos/dashboard/`
→ Check: role == SALESPERSON → Allow
→ Otherwise: Redirect to login
```

### 2. Start Sale
```
Products displayed (all / filtered by category)
User clicks product button
→ Add to cart (or increment qty)
→ Cart re-renders
→ Total updates
```

### 3. Search Product
```
User types in search box
→ JavaScript filters visible products
→ Real-time, no API calls
```

### 4. Setup Payment
```
User selects payment method (Cash/Card/Advance)
→ Enter tendered amount
→ Change auto-calculates
→ Optional: Apply discount
```

### 5. Complete Sale
```
User clicks "Complete Sale"
→ POST to /api/pos/complete-sale/
→ Backend creates Sale + SaleItems + Payment
→ Returns: bill_no, sale_id, change
→ Show success message
→ Clear cart
→ Ready for next sale
```

### 6. Print Receipt (Optional)
```
After successful sale:
→ Show bill number
→ Optional: Print receipt
→ Reset cart & totals
```

---

## API Endpoints

### GET `/pos/dashboard/`
**Purpose:** Render POS page
**Auth:** Login required, role == SALESPERSON
**Returns:** HTML page with products

**Response:**
```html
<html>
    <body>
        <div class="pos-container">
            <!-- Product grid with categories -->
            <!-- Billing panel with cart -->
        </div>
    </body>
</html>
```

---

### GET `/api/pos/search/?search=butter&category=Bread`
**Purpose:** Search products by name and category
**Auth:** Token authentication, role == SALESPERSON
**Query Params:**
- `search` (optional): Product name substring
- `category` (optional): Category filter

**Response:**
```json
{
    "results": [
        {
            "product_id": 1,
            "product_name": "Creamy Butter Loaf",
            "category": "Bread",
            "base_price": "150.00"
        }
    ],
    "count": 1
}
```

---

### GET `/api/pos/categories/`
**Purpose:** Get all product categories
**Auth:** Token authentication, role == SALESPERSON

**Response:**
```json
{
    "categories": ["Bread", "Cake", "Pastries", "Beverages"]
}
```

---

### POST `/api/pos/complete-sale/`
**Purpose:** Save completed sale to database
**Auth:** Token authentication, role == SALESPERSON
**Content-Type:** application/json

**Request Body:**
```json
{
    "items": [
        {
            "product_id": 1,
            "quantity": 2,
            "unit_price": 150.00
        },
        {
            "product_id": 5,
            "quantity": 1,
            "unit_price": 280.00
        }
    ],
    "discount_amount": 50.00,
    "payment_method": "CASH",
    "tendered_amount": 700.00
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "sale_id": 42,
    "bill_no": "BILL-20260206-A7C3F9E1",
    "total_amount": 580.00,
    "discount_amount": 50.00,
    "net_amount": 530.00,
    "payment_method": "CASH",
    "tendered_amount": 700.00,
    "change_amount": 170.00,
    "timestamp": "2026-02-06T14:30:45.123456Z"
}
```

**Error Responses:**
- `400`: Invalid data, empty cart, invalid payment method
- `403`: Not SALESPERSON role
- `500`: Database error

---

## Database Schema

### Sale Record Created
```sql
INSERT INTO sales (
    bill_no,           -- "BILL-20250206-ABC123"
    outlet_id,         -- from employee.outlet
    employee_id,       -- from authenticated user
    customer_id,       -- NULL for POS sales
    total_amount,      -- subtotal
    discount_amount,
    net_amount,        -- total - discount
    status,            -- 'COMPLETED'
    sale_date          -- timezone.now()
) VALUES (...)
```

### SaleItem Records Created (one per product)
```sql
INSERT INTO sale_items (
    sale_id,           -- FK to Sale
    batch_id,          -- Latest batch of product
    quantity,
    unit_price,
    subtotal           -- unit_price * quantity
) VALUES (...)
```

### Payment Record Created
```sql
INSERT INTO payments (
    sale_id,           -- FK to Sale
    amount,            -- net_amount
    payment_method,    -- 'CASH' | 'CARD' | 'ONLINE_TRANSFER'
    payment_status,    -- 'SUCCESS'
    reference_no       -- bill_no
) VALUES (...)
```

---

## Security & Access Control

### Role-Based Access
```python
# Only SALESPERSON can access POS
if request.user.role != RoleType.SALESPERSON:
    return Response({'error': 'Access denied'}, status=403)
```

### CSRF Protection
- Django CSRF middleware enabled
- JavaScript includes CSRF token in headers
- Template has `{% csrf_token %}`

### Authentication
- Token-based (JWT)
- Required on all API endpoints
- JavaScript retrieves token from localStorage

---

## Performance Optimization

### 1. Database Queries
```python
# Select related fields only
products.select_related().values(
    'product_id', 'product_name', 'category', 'base_price'
)

# Limit results
queryset[:50]  # Max 50 products per search
```

### 2. Frontend
- Product filtering done in JavaScript (no API call)
- Cart stored in memory (no server sync until sale)
- Minimal DOM updates (only cart re-renders on change)
- Vanilla JS (no React overhead)

### 3. CSS
- Simple, single-column grid layout
- No animations (fast rendering)
- Minimal selector complexity

---

## Customization Guide

### Change Colors
In `pos.html`, edit the `<style>` section:
```css
/* Professional neutral palette (current) */
background: #2c3e50;     /* Dark header */
color: #27ae60;          /* Green for totals */
border: 1px solid #e0e0e0; /* Light borders */

/* To customize: */
:root {
    --primary-dark: #2c3e50;
    --primary-light: #ecf0f1;
    --accent-color: #3498db;
    --success-color: #27ae60;
}
```

### Add Product Image
In `product-btn`, add image display:
```html
<div class="product-image">
    <img src="/media/products/{{ product.id }}.jpg" alt="{{ product.product_name }}">
</div>
```

### Add Barcode Scanning
In `POSManager.addToCart()`:
```javascript
// Listen for barcode scanner (enters like keyboard)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchBox.isFocused) {
        // Barcode entered in search
        // Fetch product by barcode
        this.addProductByBarcode(searchBox.value);
    }
});
```

### Add Receipt Printing
In `completeSale()`, print after success:
```javascript
this.printReceipt(data);

printReceipt(data) {
    const win = window.open('', '', 'width=400,height=600');
    win.document.write(`
        <h2>Receipt ${data.bill_no}</h2>
        <ul>
            ${data.items.map(i => `<li>${i.name} × ${i.qty}</li>`).join('')}
        </ul>
        <p>Total: ${data.net_amount}</p>
    `);
    win.print();
}
```

---

## Troubleshooting

### "Access denied" error
```
Problem: User doesn't have SALESPERSON role
Solution: Check user.role in Django admin
         Or create new user with role='SALESPERSON'
```

### "Employee not assigned to outlet"
```
Problem: User has no Employee profile or no outlet assigned
Solution: Go to Django admin > Employees
         Assign outlet to employee profile
```

### Products not loading
```
Problem: No active products in database
Solution: Add products via Django admin > Products
         Set is_active=True
```

### Sale not saving
```
Problem: Batch not found for product
Solution: Create Batch record for product
         Or modify POSCompleteOrderAPI to handle products without batches
```

---

## Development Tips

### Local Testing
1. Start Django development server
2. Create test SALESPERSON user
3. Navigate to `/pos/dashboard/`
4. Open browser DevTools (F12) → JavaScript console
5. Type `pos.cart` to see cart state

### Debug POS Manager State
```javascript
// In browser console:
console.log(pos.cart);              // See cart contents
console.log(pos.selectedPayment);   // See selected payment
pos.updateUI();                     // Force cart re-render
```

### Test API Endpoints
```bash
# Get token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"salesperson","password":"password"}'

# Search products
curl http://localhost:8000/api/pos/search/?search=bread \
  -H "Authorization: Bearer <token>"

# Complete sale
curl -X POST http://localhost:8000/api/pos/complete-sale/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d @sale.json
```

---

## Future Enhancements

1. **Barcode Scanning** - Scan products instead of clicking
2. **Receipt Printing** - Automatically print thermal receipt
3. **Inventory Tracking** - Auto-update stock after sale
4. **Customer Loyalty** - Add customer, track points
5. **Daily Reports** - Show sales summary for employee/outlet
6. **Offline Mode** - Queue sales when offline, sync later
7. **Product Images** - Display product photos
8. **Voice Commands** - "Add butter loaf, add 2 cakes"
9. **Multi-tenant** - Support multiple outlets in one session
10. **Mobile Version** - Tablet-optimized POS

---

## Questions?

For issues or improvements:
1. Check this documentation first
2. Review Django debug toolbar (`django-debug-toolbar`)
3. Check browser DevTools → Network and Console tabs
4. Test API endpoints with Postman or curl

---

**Last Updated:** 2026-02-06
**Status:** Production Ready
**Performance:** Optimized for high-volume retail
