import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import { FaBox } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import { SignedIn, UserButton, SignedOut, useUser } from "@clerk/clerk-react";
import ProductSearchForm from "./ProductSearchForm";

export default function Navigation() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Function to close mobile menu
  const closeMobileMenu = () => setIsMenuOpen(false);

  // Check if user is an admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Navigation items
  const navigationItems = [
    { path: "/shop/shoes", label: "Shoes" },
    { path: "/shop/t-shirts", label: "T-Shirt" },
    { path: "/shop/shorts", label: "Shorts" },
    { path: "/shop/pants", label: "Pants" },
    { path: "/shop/socks", label: "Socks" },
  ];

  function NavItem({ to, children, onClick }) {
    return (
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          [
            // base
            "relative inline-flex items-center font-medium text-gray-700 transition-colors duration-200",
            "py-2",
            // underline pseudo-element
            "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2",
            "after:h-[2px] after:w-full after:bg-gray-900",
            // start hidden (scale-x-0), grow from center on hover
            "after:origin-center after:scale-x-0 hover:after:scale-x-100",
            // smooth animation
            "after:transition-transform after:duration-300",
            // active state keeps the line shown
            isActive ? "text-gray-900 after:scale-x-100" : "hover:text-gray-900",
          ].join(" ")
        }
        aria-current={({ isActive }) => (isActive ? "page" : undefined)}
      >
        {children}
      </NavLink>
    );
  }


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-bold text-xl sm:text-2xl text-gray-900 flex-shrink-0"
          >
            ClothLane
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navigationItems.map((item) => (
              <NavItem key={item.path} to={item.path}>
                {item.label}
              </NavItem>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search - Hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:block">
              <ProductSearchForm />
            </div>

            {/* Cart */}
            <Link
              to="/shop/cart"
              aria-label={`Shopping cart with ${cartItemCount} items`}
              className="p-2 relative hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ShoppingBag size={20} className="text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Orders */}
            <Link
              to="/account/orders"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="My Orders"
            >
              <FaBox size={18} className="text-gray-700" />
            </Link>

            {/* Admin Dashboard */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Admin Dashboard"
                title="Admin Dashboard"
              >
                <MdAdminPanelSettings size={25} className="text-gray-700" />
              </Link>
            )}


            {/* User Authentication */}
            <SignedIn>
              <div className="flex items-center">
                <UserButton />
              </div>
            </SignedIn>

            {/* Desktop Sign In/Up */}
            <div className="hidden lg:block">
              <SignedOut>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/sign-in"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/sign-up"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              </SignedOut>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? 
                <X size={20} className="text-gray-700" /> : 
                <Menu size={20} className="text-gray-700" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white z-50 border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4">
            {/* Mobile Search */}
            <div className="sm:hidden mb-4 pb-4 border-b border-gray-200">
              <ProductSearchForm />
            </div>

             {/* Navigation Links */}
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                  >
                    <span className="block px-4 py-3 text-base">{item.label}</span>
                  </NavItem>
                ))}
              </div>

            {/* Mobile Auth Links */}
            <div className="lg:hidden mt-6 pt-4 border-t border-gray-200">
              <SignedOut>
                <div className="space-y-2">
                  <Link 
                    to="/sign-in"
                    className="block w-full text-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/sign-up"
                    className="block w-full text-center px-4 py-3 text-base font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}