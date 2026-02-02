import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutModal({ isOpen, onClose, cart, user, onPlaceOrder, isLoading }) {
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = total * 0.08;
  const grandTotal = total + deliveryFee + tax;

  const handleSubmit = async () => {
    if (!address.trim()) return;

    await onPlaceOrder({
      customer_address: address,
      notes,
      items: cart.map(item => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total_amount: grandTotal,
      // Default coordinates (can be enhanced with geocoding)
      customer_lat: 40.7128 + (Math.random() - 0.5) * 0.05,
      customer_lng: -74.0060 + (Math.random() - 0.5) * 0.05,
      restaurant_lat: 40.7128 + (Math.random() - 0.5) * 0.02,
      restaurant_lng: -74.0060 + (Math.random() - 0.5) * 0.02,
      restaurant_address: cart[0]?.restaurant || 'Local Restaurant'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <DialogTitle className="text-2xl font-bold">Checkout</DialogTitle>
          <p className="text-white/80">Complete your order</p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Order Summary</h4>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              Delivery Address
            </Label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              className="min-h-[80px]"
            />
          </div>

          {/* Special Instructions */}
          <div className="space-y-3">
            <Label>Special Instructions (Optional)</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Leave at door, call on arrival..."
            />
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay when your order arrives</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!address.trim() || isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                Place Order - ${grandTotal.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}