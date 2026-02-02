import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Package, ChefHat, Car, MapPin, Clock } from 'lucide-react';

const orderStages = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'accepted', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'picked_up', label: 'Picked Up', icon: Car },
  { key: 'delivering', label: 'On The Way', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderTracker({ currentStatus, estimatedTime, driverName }) {
  const currentIndex = orderStages.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order Status</h3>
          <p className="text-gray-500 capitalize">{currentStatus?.replace('_', ' ')}</p>
        </div>
        {estimatedTime && currentStatus !== 'delivered' && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{estimatedTime} min</span>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (orderStages.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="relative flex justify-between">
          {orderStages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-emerald-200' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`mt-3 text-xs font-medium text-center max-w-[60px] ${isCompleted ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Driver Info */}
      {driverName && ['picked_up', 'delivering'].includes(currentStatus) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-gray-50 rounded-xl flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">
            🚗
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{driverName}</p>
            <p className="text-sm text-gray-500">Your delivery partner</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
              📞
            </button>
            <button className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
              💬
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}