import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, X, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import ItemCard from '@/components/items/ItemCard';
import CartDrawer from '@/components/items/CartDrawer';
import CheckoutModal from '@/components/items/CheckoutModal';

const categories = [
  { key: 'all', label: 'All', emoji: '🍽️' },
  { key: 'food', label: 'Food', emoji: '🍕' },
  { key: 'grocery', label: 'Grocery', emoji: '🛒' },
  { key: 'pharmacy', label: 'Pharmacy', emoji: '💊' },
  { key: 'package', label: 'Package', emoji: '📦' },
];

export default function Items() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Get category from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category && categories.find(c => c.key === category)) {
      setActiveCategory(category);
    }
  }, []);

  // Load user
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => { });
  }, []);

  // Fetch items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items', activeCategory],
    queryFn: () => activeCategory === 'all'
      ? base44.entities.Item.filter({ is_available: true })
      : base44.entities.Item.filter({ category: activeCategory, is_available: true }),
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData) => base44.entities.Order.create({
      ...orderData,
      customer_email: user?.email,
      customer_name: user?.full_name,
      status: 'pending'
    }),
    onSuccess: (order) => {
      toast.success('Order placed successfully!');
      setCart([]);
      setIsCheckoutOpen(false);
      navigate(createPageUrl('Customer') + `?order=${order.id}`);
    },
    onError: (error) => {
      toast.error('Failed to place order. Please try again.');
    }
  });

  // Filter items by search
  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.restaurant?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cart functions
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing?.quantity > 1) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.id !== item.id);
    });
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.id !== itemId));
    } else {
      setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
    }
  };

  const getItemQuantity = (itemId) => {
    return cart.find(i => i.id === itemId)?.quantity || 0;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      base44.auth.redirectToLogin(window.location.href);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
          >
            Browse & Order
          </motion.h1>
          <p className="text-gray-600">Find your favorite items and get them delivered</p>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for food, groceries, restaurants..."
              className="pl-12 py-6 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all duration-300 ${activeCategory === cat.key
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-medium">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  quantity={getItemQuantity(item.id)}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartTotal > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-4 rounded-full shadow-xl shadow-emerald-500/30 flex items-center gap-3 hover:bg-emerald-600 transition-colors z-40"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold">View Cart</span>
            <Badge className="bg-white text-emerald-600">{cartTotal}</Badge>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        user={user}
        onPlaceOrder={(data) => createOrderMutation.mutate(data)}
        isLoading={createOrderMutation.isPending}
      />
    </div>
  );
}