import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, MapPin, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse & Select',
    description: 'Explore restaurants, grocery stores, and more. Find exactly what you need.',
    color: 'bg-emerald-500'
  },
  {
    icon: ShoppingBag,
    title: 'Place Order',
    description: 'Add items to your cart and checkout securely. Multiple payment options available.',
    color: 'bg-orange-500'
  },
  {
    icon: MapPin,
    title: 'Track Delivery',
    description: 'Watch your order in real-time as our driver picks it up and delivers to you.',
    color: 'bg-blue-500'
  },
  {
    icon: CheckCircle,
    title: 'Enjoy!',
    description: 'Receive your order at your doorstep. Rate your experience and tip your driver.',
    color: 'bg-purple-500'
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How GrabGo Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting your order is as easy as 1-2-3-4. Here's how it works.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-500 via-orange-500 via-blue-500 to-purple-500" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-md">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}