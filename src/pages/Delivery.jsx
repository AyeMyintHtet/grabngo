import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Power, Package, DollarSign, Clock, Loader2, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import LiveMap from '@/components/tracking/LiveMap';
import OrderRequestCard from '@/components/delivery/OrderRequestCard';
import ActiveDeliveryCard from '@/components/delivery/ActiveDeliveryCard';

// Use same mock user strategy as Customer/Items page
const DRIVER_USER = {
  id: 'driver_123',
  email: 'driver@grabngo.com',
  fullName: 'John Driver'
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function Delivery() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [todayStats, setTodayStats] = useState({ deliveries: 0, earnings: 0, hours: 0 });

  // Load user
  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setUser(DRIVER_USER);
    }, 500);
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
          // Use default location (NYC center)
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
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/orders?status=pending`);
      if (!response.ok) throw new Error('Failed to fetch pending orders');
      const data = await response.json();
      return data;
    },
    enabled: isOnline && !!user,
    refetchInterval: 3000,
  });

  // Fetch driver's active orders
  const { data: activeOrders = [], refetch: refetchActive } = useQuery({
    queryKey: ['driver-active-orders', user?.email],
    queryFn: async () => {
      // Filter by multiple statuses: accepted, preparing, picked_up, delivering
      const statuses = ['accepted', 'preparing', 'picked_up', 'delivering'].join(',');
      const response = await fetch(`${API_BASE_URL}/api/orders?driverEmail=${user.email}&status=${statuses}`);
      if (!response.ok) throw new Error('Failed to fetch active orders');
      // Fix potential API returning null/undefined for empty lists
      const data = await response.json();
      // Ensure we have an array
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user?.email,
    refetchInterval: 3000,
  });

  // Accept order mutation
  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const distance = 2 + Math.random() * 5; // 2-7 km
      const estimatedTime = Math.round(distance * 4 + 5); // ~4 min per km + 5 min prep

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'accepted',
          driverEmail: DRIVER_USER.email,
          driverName: DRIVER_USER.fullName,
          driverLat: driverLocation?.lat,
          driverLng: driverLocation?.lng,
          estimatedTime: estimatedTime,
          distanceKm: distance
        }),
      });
      if (!response.ok) throw new Error('Failed to accept order');
      return response.json();
    },
    onSuccess: () => {
      toast.success(`Order accepted! Start delivery.`, {
        duration: 2000,
        position: "top-right",
        style: {
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
        },
      });
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
        update.driverLat = driverLocation.lat;
        update.driverLng = driverLocation.lng;
      }

      // Update estimated time based on status
      if (newStatus === 'delivering') {
        update.estimatedTime = Math.round(3 + Math.random() * 5);
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });

      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    },
    onSuccess: (data, variables) => {
      const messages = {
        preparing: 'Preparing order...',
        picked_up: 'Order picked up! Start delivery.',
        delivering: 'On the way to customer.',
        delivered: 'Delivery completed! Great job!'
      };
      toast.success(messages[variables.newStatus] || 'Status updated', {
        duration: 2000,
        position: "top-right",
        style: {
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
        },
      });
      if (variables.newStatus === 'delivered') {
        setTodayStats(prev => ({
          ...prev,
          deliveries: prev.deliveries + 1,
          earnings: prev.earnings + (Number(data.totalAmount || 0) * 0.15 + 3)
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

  // Find the single current active delivery that is NOT delivered or cancelled
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
              className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-full px-8 py-6 text-lg"
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
                customerLocation={currentDelivery && currentDelivery.customerLat && currentDelivery.customerLng ? {
                  lat: Number(currentDelivery.customerLat),
                  lng: Number(currentDelivery.customerLng)
                } : null}
                restaurantLocation={currentDelivery && currentDelivery.restaurantLat && currentDelivery.restaurantLng ? {
                  lat: Number(currentDelivery.restaurantLat),
                  lng: Number(currentDelivery.restaurantLng)
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