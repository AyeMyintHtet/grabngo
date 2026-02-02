import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ItemCard({ item, quantity = 0, onAdd, onRemove }) {
  const categoryColors = {
    food: 'bg-orange-100 text-orange-600',
    grocery: 'bg-emerald-100 text-emerald-600',
    pharmacy: 'bg-blue-100 text-blue-600',
    package: 'bg-purple-100 text-purple-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 group"
    >
      <div className="relative">
        <img
          src={item.image_url || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80`}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[item.category] || 'bg-gray-100 text-gray-600'}`}>
          {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Quick Add Button */}
        {quantity === 0 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAdd(item)}
            className="absolute bottom-3 right-3 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        ) : (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white rounded-full shadow-lg p-1">
            <button
              onClick={() => onRemove(item)}
              className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-semibold text-gray-900">{quantity}</span>
            <button
              onClick={() => onAdd(item)}
              className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>

        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-emerald-600">${item.price?.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {item.restaurant && (
              <span className="truncate max-w-[80px]">{item.restaurant}</span>
            )}
            {item.prep_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{item.prep_time}m</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}