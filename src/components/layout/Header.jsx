import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingBag, MapPin, User, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    base44.auth.me().then(setUser).catch(() => { });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: 'Home', icon: <Package className="w-4 h-4" /> },
    { name: 'Order Food', path: 'Items', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Track Order', path: 'Customer', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Drive with Us', path: 'Delivery', icon: <User className="w-4 h-4" /> },
  ];

  const isHome = location.pathname === '/' || location.pathname === '/Home';
  const isDarkParams = isScrolled || !isHome;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${isDarkParams ? 'text-gray-900' : 'text-white'}`}>
              Grab<span className="text-emerald-500">Go</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={createPageUrl(link.path)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isDarkParams
                  ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className={`text-sm ${isDarkParams ? 'text-gray-600' : 'text-white/80'}`}>
                  Hi, {user.full_name?.split(' ')[0] || 'User'}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                  {user.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
            ) : (
              <Button
                onClick={() => base44.auth.redirectToLogin()}
                className="hidden sm:flex bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={isDarkParams ? 'text-gray-900' : 'text-white'}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white p-0">
                <div className="p-6 border-b bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">GrabGo</h2>
                      <p className="text-white/80 text-sm">Delivery at your doorstep</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={createPageUrl(link.path)}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                      {link.icon}
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                  {user ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => base44.auth.redirectToLogin()}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl py-6"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}