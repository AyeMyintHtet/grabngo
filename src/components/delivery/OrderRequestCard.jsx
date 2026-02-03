import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Package, Check, X } from 'lucide-react';

export default function OrderRequestCard({ order, onAccept, onDecline, isAccepting }) {
  const estimatedEarnings = (Number(order.totalAmount || 0) * 0.15 + 3).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-lg">New Order Request!</p>
              <p className="text-white/80 text-sm">#{order.id?.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${estimatedEarnings}</p>
            <p className="text-white/80 text-xs">Est. Earnings</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 space-y-4">
        {/* Pickup */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup</p>
            <p className="font-medium text-gray-900">{order.restaurantAddress || 'Restaurant Location'}</p>
          </div>
        </div>

        {/* Line */}
        <div className="ml-5 border-l-2 border-dashed border-gray-200 h-6" />

        {/* Dropoff */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Dropoff</p>
            <p className="font-medium text-gray-900">{order.customerAddress}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{order.estimatedTime || '15'} min</p>
            <p className="text-xs text-gray-500">Est. Time</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">{Number(order.distanceKm || 2.5).toFixed(1)} km</p>
            <p className="text-xs text-gray-500">Distance</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-900">${Number(order.totalAmount || 0).toFixed(2)}</p>
            <p className="text-xs text-gray-500">Order Value</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-2">{order.items?.length || 0} items</p>
          <div className="space-y-1">
            {order.items?.slice(0, 3).map((item, i) => (
              <p key={i} className="text-sm text-gray-700">{item.quantity}x {item.name}</p>
            ))}
            {order.items?.length > 3 && (
              <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onDecline(order.id)}
            className="flex-1 rounded-xl py-5 border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="w-5 h-5 mr-2" />
            Decline
          </Button>
          <Button
            onClick={() => onAccept(order.id)}
            disabled={isAccepting}
            className="flex-1 rounded-xl py-5 text-white bg-emerald-500 hover:bg-emerald-600"
          >
            <Check className="w-5 h-5 mr-2" />
            Accept
          </Button>
        </div>
      </div>
    </motion.div>
  );
}