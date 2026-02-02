import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Power, MapPin, DollarSign, Clock, Package, Loader2, Bell, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import LiveMap from '@/components/tracking/LiveMap';
import OrderRequestCard from '@/components/delivery/OrderRequestCard';
import ActiveDeliveryCard from '@/components/delivery/ActiveDeliveryCard';

export default function Delivery() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [todayStats, setTodayStats] = useState({ deliveries: 0, earnings: 0, hours: 0 });

  // Load user
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  // Get driver's current location
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Use default location
          setDriverLocation({ lat: 40.7128, lng: -74.0060 });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isOnline]);

  // Fetch pending orders (for drivers to accept)
  const { data: pendingOrders = [], refetch: refetchPending } = useQuery({
    queryKey: ['pending-orders'],
    queryFn: () => base44.entities.Order.filter({ status: 'pending' }, '-created_date'),
    enabled: isOnline && !!user,
    refetchInterval: 3000,
  });

  // Fetch driver's active orders
  const { data: activeOrders = [], refetch: refetchActive } = useQuery({
    queryKey: ['driver-active-orders', user?.email],
    queryFn: () => base44.entities.Order.filter({
      driver_email: user?.email,
      status: ['accepted', 'preparing', 'picked_up', 'delivering']
    }, '-created_date'),
    enabled: !!user?.email,
    refetchInterval: 3000,
  });

  // Subscribe to order updates
  useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = base44.entities.Order.subscribe((event) => {
      refetchPending();
      refetchActive();
    });

    return () => unsubscribe();
  }, [user?.email, refetchPending, refetchActive]);

  // Accept order mutation
  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const distance = 2 + Math.random() * 5; // 2-7 km
      const estimatedTime = Math.round(distance * 4 + 5); // ~4 min per km + 5 min prep

      return base44.entities.Order.update(orderId, {
        status: 'accepted',
        driver_email: user.email,
        driver_name: user.full_name,
        driver_lat: driverLocation?.lat,
        driver_lng: driverLocation?.lng,
        estimated_time: estimatedTime,
        distance_km: distance
      });
    },
    onSuccess: () => {
      toast.success('Order accepted! Start delivery.');
      refetchPending();
      refetchActive();
    }
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      const update = { status: newStatus };

      // Update driver location
      if (driverLocation) {
        update.driver_lat = driverLocation.lat;
        update.driver_lng = driverLocation.lng;
      }

      // Update estimated time based on status
      if (newStatus === 'delivering') {
        update.estimated_time = Math.round(3 + Math.random() * 5);
      }

      return base44.entities.Order.update(orderId, update);
    },
    onSuccess: (data, variables) => {
      const messages = {
        preparing: 'Preparing order...',
        picked_up: 'Order picked up! Start delivery.',
        delivering: 'On the way to customer.',
        delivered: 'Delivery completed! Great job!'
      };
      toast.success(messages[variables.newStatus] || 'Status updated');

      if (variables.newStatus === 'delivered') {
        setTodayStats(prev => ({
          ...prev,
          deliveries: prev.deliveries + 1,
          earnings: prev.earnings + (data.total_amount * 0.15 + 3)
        }));
      }

      refetchActive();
    }
  });

  const handleDecline = (orderId) => {
    toast.info('Order declined');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const currentDelivery = activeOrders.find(o => !['delivered', 'cancelled'].includes(o.status));

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
              Driver Dashboard
            </motion.h1>
            <p className="text-gray-600">Manage your deliveries and earnings</p>
          </div>

          {/* Online Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${isOnline
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-gray-700 border border-gray-200'
              }`}
          >
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5" />
              <span className="font-semibold">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <Switch
              checked={isOnline}
              onCheckedChange={setIsOnline}
              className="data-[state=checked]:bg-white/30"
            />
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-gray-500 text-sm">Today's Deliveries</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{todayStats.deliveries}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-500 text-sm">Earnings</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${todayStats.earnings.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-500 text-sm">Online Hours</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{todayStats.hours}h</p>
          </div>
        </motion.div>

        {!isOnline ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Car className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">You're Offline</h3>
            <p className="text-gray-500 mb-6">Go online to start receiving delivery requests</p>
            <Button
              onClick={() => setIsOnline(true)}
              className="bg-emerald-500 hover:bg-emerald-600 rounded-full px-8 py-6 text-lg"
            >
              <Power className="w-5 h-5 mr-2" />
              Go Online
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <LiveMap
                driverLocation={driverLocation}
                customerLocation={currentDelivery ? {
                  lat: currentDelivery.customer_lat,
                  lng: currentDelivery.customer_lng
                } : null}
                restaurantLocation={currentDelivery ? {
                  lat: currentDelivery.restaurant_lat,
                  lng: currentDelivery.restaurant_lng
                } : null}
                orderStatus={currentDelivery?.status}
                className="h-[500px] shadow-lg"
              />
            </motion.div>

            {/* Orders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Current Delivery */}
              {currentDelivery && (
                <ActiveDeliveryCard
                  order={currentDelivery}
                  onUpdateStatus={(orderId, newStatus) =>
                    updateStatusMutation.mutate({ orderId, newStatus })
                  }
                  isUpdating={updateStatusMutation.isPending}
                />
              )}

              {/* Pending Orders */}
              {!currentDelivery && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Available Orders</h3>
                    <Badge className="bg-orange-100 text-orange-700">{pendingOrders.length}</Badge>
                  </div>

                  <AnimatePresence mode="popLayout">
                    {pendingOrders.length > 0 ? (
                      pendingOrders.slice(0, 3).map((order) => (
                        <OrderRequestCard
                          key={order.id}
                          order={order}
                          onAccept={(id) => acceptOrderMutation.mutate(id)}
                          onDecline={handleDecline}
                          isAccepting={acceptOrderMutation.isPending}
                        />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl p-12 text-center border border-gray-100"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">No orders available</h4>
                        <p className="text-gray-500">New orders will appear here</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}