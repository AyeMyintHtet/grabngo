import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Car, DollarSign, Clock, Shield, ArrowRight } from 'lucide-react';

export default function CTASection() {
  const benefits = [
    { icon: DollarSign, text: 'Earn up to $25/hour' },
    { icon: Clock, text: 'Flexible schedule' },
    { icon: Shield, text: 'Insurance coverage' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 rounded-full px-4 py-2 mb-6">
              <Car className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Drive with GrabGo</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Turn your car into a
              <span className="text-emerald-400"> money machine</span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              Join thousands of drivers earning on their own schedule. No boss, no office, just you and the road. Start earning today!
            </p>

            <div className="flex flex-wrap gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-white font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            <Link to={createPageUrl('Delivery')}>
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-xl shadow-emerald-500/30 group"
              >
                Start Driving
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80"
                alt="Driver"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-500">Active Drivers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">$25</div>
                    <div className="text-sm text-gray-500">Avg. Hourly</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9</div>
                    <div className="text-sm text-gray-500">Driver Rating</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}