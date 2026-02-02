import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, MapPin, Loader2, ShoppingBag, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

import LiveMap from '@/components/tracking/LiveMap';
import OrderTracker from '@/components/tracking/OrderTracker';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  picked_up: 'bg-purple-100 text-purple-700',
  delivering: 'bg-emerald-100 text-emerald-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Customer() {
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  // Load user
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  // Get order from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');
    if (orderId) {
      setSelectedOrder({ id: orderId });
    }
  }, []);

  // Fetch user's orders
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['customer-orders', user?.email],
    queryFn: () => base44.entities.Order.filter({ customer_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  // Subscribe to order updates
  useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = base44.entities.Order.subscribe((event) => {
      if (event.data?.customer_email === user.email) {
        refetch();
      }
    });

    return () => unsubscribe();
  }, [user?.email, refetch]);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  // Auto-select first active order or URL order
  useEffect(() => {
    if (selectedOrder?.id) {
      const found = orders.find(o => o.id === selectedOrder.id);
      if (found) setSelectedOrder(found);
    } else if (activeOrders.length > 0) {
      setSelectedOrder(activeOrders[0]);
    }
  }, [orders, selectedOrder?.id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
            >
              My Orders
            </motion.h1>
            <p className="text-gray-600">Track your deliveries in real-time</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start ordering delicious food!</p>
            <Link to={createPageUrl('Items')}>
              <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-full px-8">
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-1 space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-white border">
                  <TabsTrigger value="active" className="flex-1">
                    Active ({activeOrders.length})
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1">
                    Past ({pastOrders.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {activeOrders.map((order) => (
                      <motion.button
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${selectedOrder?.id === order.id
                            ? 'bg-emerald-50 border-2 border-emerald-500'
                            : 'bg-white border border-gray-200 hover:border-emerald-300'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order.id?.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(order.created_date), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <Badge className={statusColors[order.status]}>
                            {order.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4" />
                          <span>{order.items?.length || 0} items</span>
                          <span>•</span>
                          <span>${order.total_amount?.toFixed(2)}</span>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>

                  {activeOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No active orders
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-4 space-y-3">
                  {pastOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${selectedOrder?.id === order.id
                          ? 'bg-gray-100 border-2 border-gray-400'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{order.id?.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(order.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        ${order.total_amount?.toFixed(2)}
                      </div>
                    </button>
                  ))}

                  {pastOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No past orders
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedOrder ? (
                <>
                  {/* Map */}
                  {!['delivered', 'cancelled'].includes(selectedOrder.status) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <LiveMap
                        driverLocation={
                          selectedOrder.driver_lat && selectedOrder.driver_lng
                            ? { lat: selectedOrder.driver_lat, lng: selectedOrder.driver_lng }
                            : null
                        }
                        customerLocation={
                          selectedOrder.customer_lat && selectedOrder.customer_lng
                            ? { lat: selectedOrder.customer_lat, lng: selectedOrder.customer_lng }
                            : null
                        }
                        restaurantLocation={
                          selectedOrder.restaurant_lat && selectedOrder.restaurant_lng
                            ? { lat: selectedOrder.restaurant_lat, lng: selectedOrder.restaurant_lng }
                            : null
                        }
                        orderStatus={selectedOrder.status}
                        className="h-[300px] shadow-lg"
                      />
                    </motion.div>
                  )}

                  {/* Order Tracker */}
                  <OrderTracker
                    currentStatus={selectedOrder.status}
                    estimatedTime={selectedOrder.estimated_time}
                    driverName={selectedOrder.driver_name}
                  />

                  {/* Order Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>

                    <div className="space-y-4">
                      {/* Delivery Address */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Delivery Address</p>
                          <p className="font-medium text-gray-900">{selectedOrder.customer_address}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Items Ordered</p>
                        <div className="space-y-2">
                          {selectedOrder.items?.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span className="text-gray-700">{item.quantity}x {item.name}</span>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between pt-3 border-t font-bold">
                            <span>Total</span>
                            <span className="text-emerald-600">${selectedOrder.total_amount?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}