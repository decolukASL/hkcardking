"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface CardDetailClientProps {
  card: {
    pc_id: string;
    pc_name: string;
    pc_price: number;
    pc_desc: string;
    images: string[];
  }
}

export default function CardDetailClient({ card }: CardDetailClientProps) {
  const [mainImage, setMainImage] = useState(card.images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column: Image Gallery */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 border shadow-sm">
          <Image 
            src={mainImage} 
            alt={card.pc_name} 
            fill 
            className="object-contain" 
            unoptimized 
          />
        </div>
        
        {/* Thumbnails */}
        {card.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {card.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)} 
                className={`relative w-20 aspect-[2/3] flex-shrink-0 rounded-md overflow-hidden border-2 transition ${
                  mainImage === img ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Details & Actions */}
      <div className="md:w-1/2 flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{card.pc_name}</h1>
          <p className="text-gray-500">Card ID: {card.pc_id}</p>
        </div>

        <div className="text-4xl font-bold text-red-600 mb-8">
          ${card.pc_price.toFixed(2)}
        </div>

        <div className="prose max-w-none text-gray-700 mb-8 flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="whitespace-pre-line leading-relaxed">{card.pc_desc}</p>
        </div>

        <div className="mt-auto pt-6 border-t">
          <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.98]">
            <ShoppingCart size={24} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}