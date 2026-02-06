import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/shop/Register';
import LoginPage from './pages/employee/LoginPage';
import EmployeeSignup from './pages/employee/EmployeeSignup';

// Import Dashboards
import POSDashboard from './pages/dashboards/POSDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdminPortal from './pages/admin/AdminPortal';
import RequireAdmin from './components/RequireAdmin';

// Factory Manager Pages
import FactoryManagerDashboard from './pages/factory/FactoryManagerDashboard';
import OutletOrders from './pages/factory/OutletOrders';
import CustomerOrders from './pages/factory/CustomerOrders';
import OutletMonitor from './pages/factory/OutletMonitor';
import Batches from './pages/factory/Batches';
import Products from './pages/factory/Products';

// Legacy Factory Operations
import BatchEntry from './pages/factory/BatchEntry';
import AddProduct from './pages/factory/AddProduct';

// Customer Portal Pages
import ShopHome from './pages/shop/ShopHome';
import ProductDetail from './pages/shop/ProductDetail';
import CartPage from './pages/shop/CartPage';
import Checkout from './pages/shop/Checkout';
import Orders from './pages/shop/Orders';
import CustomerLoginPage from './pages/shop/CustomerLoginPage';
import UserProfile from './pages/shop/UserProfile';
import OrderTrackingPage from './pages/shop/OrderTracking';
import EmployeeListView from './pages/employee/EmployeeListView';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            1. EMPLOYEE PORTAL (ENTRY & AUTH)
            Root URL now directs to the internal login.
            ========================================== */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ==========================================
            2. ADMIN PORTAL (ERP SYSTEM)
            Dedicated paths for system administration.
            ========================================== */}
        <Route path="/admin" element={<RequireAdmin><Navigate to="/admin/portal" replace/></RequireAdmin>} />
        <Route path="/admin/portal" element={<RequireAdmin><AdminPortal /></RequireAdmin>} />
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/signup-employee" element={<RequireAdmin><EmployeeSignup /></RequireAdmin>} />
        <Route path="/employee/EmployeeListView" element={<RequireAdmin><EmployeeListView /></RequireAdmin>} />
        
        {/* ==========================================
            3. CUSTOMER PORTAL (E-COMMERCE)
            Public-facing site at a separate /shop URL.
            ========================================== */}
        <Route path="/shop" element={<CartProvider><ShopHome /></CartProvider>} />
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<CartProvider><ProductDetail /></CartProvider>} />
        <Route path="/cart" element={<CartProvider><CartPage /></CartProvider>} />
        <Route path="/checkout" element={<CartProvider><Checkout /></CartProvider>} />
        <Route path="/orders" element={<CartProvider><Orders /></CartProvider>} />
        <Route path="/order/:orderId" element={<CartProvider><OrderTrackingPage /></CartProvider>} />
        <Route path="/profile" element={<CartProvider><UserProfile /></CartProvider>} />

        {/* ==========================================
            4. STAFF OPERATIONS (POS & FACTORY)
            Internal workflows for staff members.
            ========================================== */}
        <Route path="/pos" element={<POSDashboard />} />

        {/* Factory Manager Routes */}
        <Route path="/factory-manager" element={<FactoryManagerDashboard />} />
        <Route path="/factory-manager/outlet-orders" element={<OutletOrders />} />
        <Route path="/factory-manager/customer-orders" element={<CustomerOrders />} />
        <Route path="/factory-manager/outlet-monitor" element={<OutletMonitor />} />
        <Route path="/factory-manager/batches" element={<Batches />} />
        <Route path="/factory-manager/products" element={<Products />} />

        {/* Factory Legacy Operations (Redirects & Forms) */}
        <Route path="/factory" element={<Navigate to="/factory-manager" replace />} />
        <Route path="/factory/ProductList" element={<Navigate to="/factory-manager/products" replace />} />
        <Route path="/factory/BatchList" element={<Navigate to="/factory-manager/batches" replace />} />
        <Route path="/factory/BatchEntry" element={<BatchEntry/>}/>
        <Route path="/factory/AddProduct" element={<AddProduct/>}/>

        {/* Catch-all Redirect for invalid dashboard or root requests */}
        <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;