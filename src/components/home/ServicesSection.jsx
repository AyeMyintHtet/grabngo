import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ShoppingCart, Pill, Package, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: UtensilsCrossed,
    title: 'Food Delivery',
    description: 'Get your favorite meals from top restaurants delivered hot and fresh.',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    category: 'food'
  },
  {
    icon: ShoppingCart,
    title: 'Grocery',
    description: 'Fresh produce, pantry essentials, and more delivered to your door.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    category: 'grocery'
  },
  {
    icon: Pill,
    title: 'Pharmacy',
    description: 'Medicines and healthcare products delivered safely and discreetly.',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    category: 'pharmacy'
  },
  {
    icon: Package,
    title: 'Package Delivery',
    description: 'Send and receive packages across the city with ease.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    category: 'package'
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need, one app
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From food to groceries to packages, we've got you covered with fast and reliable delivery.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`${createPageUrl('Items')}?category=${service.category}`}
                className="group block"
              >
                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 h-full">
                  <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center text-emerald-600 font-medium">
                    <span>Order now</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>

                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}