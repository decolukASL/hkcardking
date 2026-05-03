import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CardDetailClient from './CardDetailClient';

// Mock function to fetch single card detail
async function getCardDetail(id: string) {
  // In a real application, this would call /api/data with FUNC_EXEC: 'GET_CARD_DETAIL'
  const numericId = parseInt(id.replace('CARD_', '') || '0');
  
  return {
    pc_id: id,
    pc_name: `Rare Trading Card ${numericId + 1}`,
    pc_price: 199.99 + (numericId * 10),
    pc_desc: "This is a highly sought-after trading card in mint condition. Perfect for collectors and competitive players alike.\n\nFeatures stunning holographic artwork and authenticated grading. Preserved in a temperature-controlled environment to maintain its pristine edges and surface quality.\n\nIncludes original protective casing.",
    images: [
      `https://via.placeholder.com/600x900?text=Main+Image+${numericId + 1}`,
      `https://via.placeholder.com/600x900?text=Back+Image+${numericId + 1}`,
      `https://via.placeholder.com/600x900?text=Detail+Image+${numericId + 1}`
    ]
  };
}

export default async function CardDetailPage({ params }: { params: { id: string } }) {
  const card = await getCardDetail(params.id);

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition font-medium">
        <ArrowLeft size={20} className="mr-2" />
        Back to Home
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
        <CardDetailClient card={card} />
      </div>
    </div>
  );
}