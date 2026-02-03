import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = total > 0 ? 2.99 : 0;
  const tax = total * 0.08;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col bg-white">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-xl">Your Cart</span>
              <p className="text-sm text-gray-500 font-normal">{cart.length} items</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-emerald-200" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6">
              Explore our menu and add items to your cart
            </p>
            <Button onClick={onClose} className="rounded-full bg-emerald-500 hover:bg-emerald-600">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 bg-emerald-50/50 rounded-xl"
                  >
                    <img
                      src={item.imageUrl || `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-emerald-600 font-semibold">${Number(item.price || 0).toFixed(2)}</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center border hover:bg-emerald-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="border-t p-6 space-y-4 bg-emerald-50/30">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>${(total + deliveryFee + tax).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={onCheckout}
                className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl py-6 text-lg text-white font-semibold group"
              >
                Checkout
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}