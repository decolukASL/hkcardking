"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, CreditCard } from 'lucide-react';

// Mock Cart Item Type
interface CartItem {
  pc_id: string;
  pc_name: string;
  pc_price: number;
  pci_path: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      pc_id: 'CARD_1',
      pc_name: 'Rare Trading Card 1',
      pc_price: 199.99,
      pci_path: 'https://via.placeholder.com/100x150?text=Card+1',
      quantity: 1
    },
    {
      pc_id: 'CARD_2',
      pc_name: 'Rare Trading Card 2',
      pc_price: 209.99,
      pci_path: 'https://via.placeholder.com/100x150?text=Card+2',
      quantity: 1
    }
  ]);

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.pc_id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(cartItems.map(item => {
      if (item.pc_id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.pc_price * item.quantity), 0);

  const handleCheckout = () => {
    alert(`Checking out! Total amount: $${totalAmount.toFixed(2)}`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            {cartItems.map(item => (
              <div key={item.pc_id} className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
                <div className="relative w-20 h-32 flex-shrink-0">
                  <Image 
                    src={item.pci_path} 
                    alt={item.pc_name} 
                    fill 
                    className="object-cover rounded" 
                    unoptimized 
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-800">{item.pc_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">ID: {item.pc_id}</p>
                  <p className="font-bold text-red-600">${item.pc_price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded">
                    <button onClick={() => updateQuantity(item.pc_id, -1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                    <span className="px-3 py-1 border-x font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.pc_id, 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.pc_id)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-40">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
              
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="flex justify-between mb-6 pt-4 border-t font-bold text-lg">
                <span>Total</span>
                <span className="text-red-600">${totalAmount.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}