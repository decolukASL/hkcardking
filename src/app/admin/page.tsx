"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ValidationCard {
  pcv_id: string;
  pcv_number: string;
  pcv_name: string;
  pcv_price: number;
  pcv_date: string;
  su_id: string | null;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingCards, setPendingCards] = useState<ValidationCard[]>([]);

  useEffect(() => {
    if (isAdmin) {
      // Fetch pending cards here
      setPendingCards([
        { pcv_id: 'V1', pcv_number: 'PKM-001', pcv_name: 'Pikachu Holo', pcv_price: 500, pcv_date: '2026-05-04', su_id: null },
        { pcv_id: 'V2', pcv_number: 'YGO-001', pcv_name: 'Blue Eyes White Dragon', pcv_price: 1200, pcv_date: '2026-05-04', su_id: null }
      ]);
    }
  }, [isAdmin]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate admin login
    setIsAdmin(true);
  };

  const handleApprove = async (id: string) => {
    // In a real app, this would call SP_SYS to approve
    const payload = {
      FUNC_TYPE: "ADMIN",
      FUNC_LANG: "EN",
      FUNC_DATA: { pcv_id: id },
      FUNC_EXEC: "APPROVE_CARD"
    };

    console.log("Approving:", payload);
    setPendingCards(pendingCards.filter(c => c.pcv_id !== id));
    alert('Card Approved and moved to ePostCard table!');
  };

  const handleReject = (id: string) => {
    setPendingCards(pendingCards.filter(c => c.pcv_id !== id));
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 mt-12">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">System Administrator</h1>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
            <input type="text" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
            <input type="password" required className="w-full px-3 py-2 border rounded-md" />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
            Admin Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Card Validation Approvals</h1>
      
      {pendingCards.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pending cards to approve.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 font-semibold text-sm text-gray-600">ID</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-600">Number</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-600">Name</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-600">Price</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-600">Date</th>
                <th className="px-4 py-3 font-semibold text-sm text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingCards.map(card => (
                <tr key={card.pcv_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{card.pcv_id}</td>
                  <td className="px-4 py-3 text-sm">{card.pcv_number}</td>
                  <td className="px-4 py-3 font-medium">{card.pcv_name}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">${card.pcv_price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{card.pcv_date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleApprove(card.pcv_id)} className="flex items-center text-green-600 hover:bg-green-50 px-2 py-1 rounded">
                        <CheckCircle size={18} className="mr-1" /> Approve
                      </button>
                      <button onClick={() => handleReject(card.pcv_id)} className="flex items-center text-red-600 hover:bg-red-50 px-2 py-1 rounded">
                        <XCircle size={18} className="mr-1" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}