import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Package, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Food Delivery', path: 'Items' },
      { name: 'Grocery', path: 'Items' },
      { name: 'Package Delivery', path: 'Items' },
      { name: 'Pharmacy', path: 'Items' },
    ],
    company: [
      { name: 'About Us', path: 'Home' },
      { name: 'Careers', path: 'Home' },
      { name: 'Blog', path: 'Home' },
      { name: 'Press', path: 'Home' },
    ],
    support: [
      { name: 'Help Center', path: 'Home' },
      { name: 'Safety', path: 'Home' },
      { name: 'Terms of Service', path: 'Home' },
      { name: 'Privacy Policy', path: 'Home' },
    ],
    drivers: [
      { name: 'Become a Driver', path: 'Delivery' },
      { name: 'Driver Requirements', path: 'Delivery' },
      { name: 'Driver Support', path: 'Delivery' },
      { name: 'Earnings', path: 'Delivery' },
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#' },
    { icon: <Twitter className="w-5 h-5" />, href: '#' },
    { icon: <Instagram className="w-5 h-5" />, href: '#' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                Grab<span className="text-emerald-400">Go</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your everyday everything app. Get food, groceries, packages, and more delivered to your doorstep in minutes.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>123 Tech Park, Silicon Valley, CA</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span>support@grabgo.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Drivers */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Drivers</h3>
            <ul className="space-y-3">
              {footerLinks.drivers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} GrabGo. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}