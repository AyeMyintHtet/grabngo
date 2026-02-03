import React, { useState, useEffect } from 'react';
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
  const [user, setUser] = useState({
    email: 'demo@example.com',
    full_name: 'Demo User',
    address: '123 Main St'
  });

  // Get category from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category && categories.find(c => c.key === category)) {
      setActiveCategory(category);
    }
  }, []);

  // Fetch items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items', activeCategory],
    queryFn: async () => {
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/items`);
      if (activeCategory !== 'all') {
        url.searchParams.append('category', activeCategory);
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch items');
      return res.json();
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData) => {
      const payload = {
        customerEmail: user?.email,
        customerName: user?.full_name,
        customerAddress: orderData.address || user?.address,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl
        })),
        restaurantLat: orderData?.restaurant_lat,
        restaurantLng: orderData?.restaurant_lng,
        totalAmount: cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0),
        status: 'pending',
        restaurantAddress: orderData?.restaurant_address || 'Local Store',
        notes: orderData?.notes,
        customerLat: orderData?.customer_lat,
        customerLng: orderData?.customer_lng,
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to create order');
      return res.json();
    },
    onSuccess: (order) => {
      toast.success(`Order placed successfully!`, {
        duration: 2000,
        position: "top-right",
        style: {
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
        },
      });
      setCart([]);
      setIsCheckoutOpen(false);
      navigate(createPageUrl('Customer') + `?order=${order.id}`);
    },
    onError: (error) => {
      console.error(error);
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
    toast.success(`${item.name} added to cart`, {
      duration: 2000,
      position: "top-right",
      style: {
        backgroundColor: '#10B981',
        color: 'white',
        border: 'none',
      },
      icon: <img src={item.imageUrl || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50&q=80`} alt={item.name} className="w-8 h-8 rounded-full object-cover border border-white/20" />,
    });
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
      // Logic for unauthenticated checkout or redirect
      toast.error("Please login to checkout");
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
              placeholder="Search for food, groceries..."
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