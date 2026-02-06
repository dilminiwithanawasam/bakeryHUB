import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu } from 'lucide-react';
import logo from '../assets/bakeryHUB.png';

interface HeaderProps {
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isShopRoute = location.pathname.startsWith('/shop') || location.pathname === '/cart' || location.pathname === '/checkout';
  const isEmployeeRoute = location.pathname.startsWith('/pos') || location.pathname.startsWith('/factory') || location.pathname.startsWith('/employee') || location.pathname.startsWith('/admin');

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (isEmployeeRoute) {
    return null; // Don't show header on employee routes
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-50 to-yellow-50 border-b-2 border-orange-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/shop')}>
            <img src={logo} alt="BakeryHUB Logo" className="h-14 w-14 object-contain" />
            <div className="hidden sm:flex flex-col">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">BakeryHUB</span>
              <span className="text-xs text-orange-600 font-semibold">Fresh Baked Goodness</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavigation('/shop')}
              className={`font-semibold transition ${location.pathname === '/shop' || location.pathname === '/'
                ? 'text-orange-600 border-b-3 border-orange-600'
                : 'text-gray-700 hover:text-orange-600'
                }`}
            >
              Shop
            </button>
            {/* Add more nav items as needed */}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isShopRoute && (
              <>
                <button
                  onClick={() => handleNavigation('/cart')}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition"
                >
                  <ShoppingCart size={20} />
                  <span className="hidden sm:inline text-sm">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    localStorage.clear();
                    handleNavigation('/login');
                  }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-red-500 hover:text-red-500 transition"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-orange-100 transition"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t-2 border-orange-200 pt-4">
            <button
              onClick={() => handleNavigation('/shop')}
              className="block w-full text-left px-4 py-2 text-gray-700 font-semibold hover:bg-orange-100 rounded-lg transition"
            >
              Shop
            </button>
            {isShopRoute && (
              <>
                <button
                  onClick={() => handleNavigation('/cart')}
                  className="block w-full text-left px-4 py-2 text-orange-700 font-semibold hover:bg-orange-100 rounded-lg transition"
                >
                  Cart ({cartCount})
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    handleNavigation('/login');
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
