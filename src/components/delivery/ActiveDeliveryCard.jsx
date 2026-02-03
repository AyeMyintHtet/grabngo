import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Navigation, Package, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * ActiveDeliveryCard Component
 * 
 * Displays the current active order for a driver.
 * Handles the state transitions: accepted -> preparing -> picked_up -> delivering -> delivered.
 * Dynamically shows Pickup vs Dropoff details based on the current status.
 */

// Define the delivery workflow states and transitions
const statusFlow = {
  accepted: { next: 'preparing', label: 'Start Preparing', icon: Package },
  preparing: { next: 'picked_up', label: 'Mark as Picked Up', icon: Package },
  picked_up: { next: 'delivering', label: 'Start Delivery', icon: Navigation },
  delivering: { next: 'delivered', label: 'Complete Delivery', icon: CheckCircle },
};

export default function ActiveDeliveryCard({ order, onUpdateStatus, isUpdating }) {
  if (!order) return null;

  // Determine current step in the flow
  // Default to accepted if status is unknown/invalid to avoid crashes
  const currentStatus = statusFlow[order.status];

  // Robust data access: handle potential mixed casing (camelCase vs snake_case) or missing values
  // This ensures the component works regardless of API response format changes
  const customerName = order.customerName || order.customer_name || 'Customer';
  const customerAddress = order.customerAddress || order.customer_address || 'No address provided';
  const restaurantAddress = order.restaurantAddress || order.restaurant_address || 'No address provided';
  const totalAmount = Number(order.totalAmount || order.total_amount || 0);
  const items = Array.isArray(order.items) ? order.items : [];

  // Format Order ID safely
  const displayId = order.id ? order.id.slice(-6).toUpperCase() : '----';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header - Gradient background matches project theme */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Active Delivery</p>
            <p className="font-bold text-xl">#{displayId}</p>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-full">
            <span className="font-medium capitalize">{order.status?.replace('_', ' ') || 'Unknown'}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Customer Info Section */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="font-semibold text-gray-900">{customerName}</p>
              <p className="text-sm text-gray-500 line-clamp-1">{customerAddress}</p>
            </div>
          </div>
          {/* Call Customer Button (Mock) */}
          <button className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
        </div>

        {/* Route Details - Smart Toggle based on Status */}
        <div className="space-y-3">
          {/* Pickup Details: Shown only during pre-pickup phases */}
          {['accepted', 'preparing'].includes(order.status) && (
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <p className="text-xs text-orange-600 font-medium">PICKUP LOCATION</p>
                <p className="font-medium text-gray-900">{restaurantAddress}</p>
              </div>
            </div>
          )}

          {/* Delivery Details: Shown only during post-pickup phases */}
          {['picked_up', 'delivering'].includes(order.status) && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">DELIVERY LOCATION</p>
                <p className="font-medium text-gray-900">{customerAddress}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items Summary */}
        <div className="border border-gray-100 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-2 font-medium">Order Items</p>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.quantity}x {item.name}</span>
                <span className="font-medium text-gray-900">
                  ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1 border-t border-gray-100 font-semibold">
              <span>Total</span>
              <span className="text-emerald-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button - Changes label/icon based on status */}
        {currentStatus && (
          <Button
            onClick={() => onUpdateStatus(order.id, currentStatus.next)}
            disabled={isUpdating}
            className="w-full rounded-xl py-6 bg-emerald-500 hover:bg-emerald-600 text-white text-lg group shadow-emerald-200 shadow-lg"
          >
            <currentStatus.icon className="w-5 h-5 mr-2" />
            {currentStatus.label}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {/* Completion Message */}
        {order.status === 'delivered' && (
          <div className="text-center p-6 bg-emerald-50 rounded-xl animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-semibold text-emerald-700">Delivery Completed!</p>
            <p className="text-emerald-600 text-sm">Great job! Ready for the next order.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}