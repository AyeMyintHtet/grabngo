import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Package, CheckCircle, ArrowRight } from 'lucide-react';

const statusFlow = {
  accepted: { next: 'preparing', label: 'Start Preparing', icon: Package },
  preparing: { next: 'picked_up', label: 'Mark as Picked Up', icon: Package },
  picked_up: { next: 'delivering', label: 'Start Delivery', icon: Navigation },
  delivering: { next: 'delivered', label: 'Complete Delivery', icon: CheckCircle },
};

export default function ActiveDeliveryCard({ order, onUpdateStatus, isUpdating }) {
  const currentStatus = statusFlow[order.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Active Delivery</p>
            <p className="font-bold text-xl">#{order.id?.slice(-6).toUpperCase()}</p>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-full">
            <span className="font-medium capitalize">{order.status?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Customer Info */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">{order.customer_name || 'Customer'}</p>
              <p className="text-sm text-gray-500">{order.customer_address}</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600">
            <Phone className="w-5 h-5" />
          </button>
        </div>

        {/* Route */}
        <div className="space-y-3">
          {/* Pickup */}
          {['accepted', 'preparing'].includes(order.status) && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-xs text-orange-600 font-medium">PICKUP LOCATION</p>
                <p className="font-medium text-gray-900">{order.restaurant_address || 'Restaurant'}</p>
              </div>
            </div>
          )}

          {/* Dropoff */}
          {['picked_up', 'delivering'].includes(order.status) && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">DELIVERY LOCATION</p>
                <p className="font-medium text-gray-900">{order.customer_address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2">Order Items</p>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.quantity}x {item.name}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t font-semibold">
              <span>Total</span>
              <span className="text-emerald-600">${order.total_amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {currentStatus && (
          <Button
            onClick={() => onUpdateStatus(order.id, currentStatus.next)}
            disabled={isUpdating}
            className="w-full rounded-xl py-6 bg-emerald-500 hover:bg-emerald-600 text-lg group"
          >
            <currentStatus.icon className="w-5 h-5 mr-2" />
            {currentStatus.label}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {order.status === 'delivered' && (
          <div className="text-center p-6 bg-emerald-50 rounded-xl">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-emerald-700">Delivery Completed!</p>
            <p className="text-emerald-600 text-sm">Great job! Ready for next order.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}