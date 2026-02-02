import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  Home,
  ShoppingBag,
  MapPin,
  Car,
  Settings,
  HelpCircle,
  LogOut,
  Package
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const mainNav = [
    { name: 'Home', path: 'Home', icon: Home },
    { name: 'Browse Items', path: 'Items', icon: ShoppingBag },
    { name: 'My Orders', path: 'Customer', icon: MapPin },
    { name: 'Driver Mode', path: 'Delivery', icon: Car },
  ];

  const secondaryNav = [
    { name: 'Settings', path: 'Home', icon: Settings },
    { name: 'Help Center', path: 'Home', icon: HelpCircle },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname.split('/').pop();
    return currentPath === path;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 lg:hidden"
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Grab<span className="text-emerald-500">Go</span>
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="p-4">
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </p>
            <ul className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={createPageUrl(item.path)}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-emerald-500' : ''}`} />
                      <span className="font-medium">{item.name}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Support
            </p>
            <ul className="space-y-1">
              {secondaryNav.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={createPageUrl(item.path)}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}