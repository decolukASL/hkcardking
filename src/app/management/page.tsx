"use client";

import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';

export default function ManagementPage() {
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    pcv_number: '',
    pcv_name: '',
    pcv_desc: '',
    pcv_name_key: '',
    pcv_price: '',
    pcv_level: '',
    pcv_org: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 2) {
        alert("Maximum 2 images allowed");
        return;
      }
      setImages([...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would use FormData to upload files via API
    // For now, simulating the process:
    const payload = {
      FUNC_TYPE: "CARD",
      FUNC_LANG: "EN",
      FUNC_DATA: {
        ...formData,
        // In real app, we'd send files to an upload endpoint first to get atm_key paths
        images: images.map(img => img.name)
      },
      FUNC_EXEC: "CREATE_VALIDATION"
    };

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data && !data.error) {
        alert('Card submitted for validation successfully!');
        // Reset form
        setFormData({
          pcv_number: '', pcv_name: '', pcv_desc: '', pcv_name_key: '', 
          pcv_price: '', pcv_level: '', pcv_org: ''
        });
        setImages([]);
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting card');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Card Validation Submission</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input type="text" required className="w-full px-3 py-2 border rounded-md"
              value={formData.pcv_number} onChange={(e) => setFormData({...formData, pcv_number: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
            <input type="text" required className="w-full px-3 py-2 border rounded-md"
              value={formData.pcv_name} onChange={(e) => setFormData({...formData, pcv_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Key (Unique ID)</label>
            <input type="text" required className="w-full px-3 py-2 border rounded-md"
              value={formData.pcv_name_key} onChange={(e) => setFormData({...formData, pcv_name_key: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="number" step="0.01" required className="w-full px-3 py-2 border rounded-md"
              value={formData.pcv_price} onChange={(e) => setFormData({...formData, pcv_price: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level / Rarity</label>
            <input type="number" className="w-full px-3 py-2 border rounded-md"
              value={formData.pcv_level} onChange={(e) => setFormData({...formData, pcv_level: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Brand</label>
            <input type="text" required className="w-full px-3 py-2 border rounded-md"
              value={formData.pcv_org} onChange={(e) => setFormData({...formData, pcv_org: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={4} required className="w-full px-3 py-2 border rounded-md"
            value={formData.pcv_desc} onChange={(e) => setFormData({...formData, pcv_desc: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Images (Max 2)</label>
          <div className="flex gap-4 mb-4">
            {images.map((file, idx) => (
              <div key={idx} className="relative w-32 h-48 bg-gray-100 border rounded-lg flex items-center justify-center">
                <span className="text-xs text-center px-2 truncate w-full">{file.name}</span>
                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 2 && (
              <label className="w-32 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-500 hover:text-blue-500">
                <Upload size={24} className="mb-2" />
                <span className="text-xs font-medium">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} multiple />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500">First image will be used as the main display. Images will be saved to tempimage folder.</p>
        </div>

        <div className="pt-4 border-t">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition flex items-center justify-center">
            <Plus size={20} className="mr-2" /> Submit for Validation
          </button>
        </div>
      </form>
    </div>
  );
}