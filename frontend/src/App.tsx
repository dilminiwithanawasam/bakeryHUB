import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/employee/LoginPage';
import EmployeeSignup from './pages/employee/EmployeeSignup';

// Import the new specific Dashboards
import POSDashboard from './pages/dashboards/POSDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FactoryDashboard from './pages/dashboards/FactoryDashboard';
import BatchEntry from './pages/factory/BatchEntry';
import AddProduct from './pages/factory/AddProduct';
import ProductList from './pages/factory/ProductList';
import BatchList from './pages/factory/BatchList';
import EmployeeListView from './pages/employee/EmployeeListView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/signup-employee" element={<EmployeeSignup />} />
        <Route path="/employee/EmployeeListView" element={<EmployeeListView />} />
        
        {/* Other Role Routes */}
        <Route path="/pos" element={<POSDashboard />} />
        <Route path="/factory" element={<FactoryDashboard />} />
        <Route path="/factory/BatchEntry" element={<BatchEntry/>}/>
        <Route path="/factory/AddProduct" element={<AddProduct/>}/>
        <Route path="/factory/ProductList" element={<ProductList/>}/>
        <Route path="/factory/BatchList" element={<BatchList/>}/>
        
        {/* Default Redirect: If someone goes to root /, send them to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Fallback: If someone tries to go to /dashboard (old link), send them to login to get re-routed */}
        <Route path="/dashboard" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;