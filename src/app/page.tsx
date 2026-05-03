import Image from 'next/image';
import Link from 'next/link';

// Mock data types
interface News {
  ns_id: string;
  ns_content: string;
  ns_date: string;
}

interface PostCard {
  pc_id: string;
  pc_name: string;
  pc_price: number;
  pci_path: string;
}

// In a real scenario, this would fetch from our /api/news and /api/cards endpoints
async function getNews(): Promise<News[]> {
  // Simulating API call
  return [
    { ns_id: '1', ns_content: 'New Pokemon Set Released!', ns_date: '2026-05-04' },
    { ns_id: '2', ns_content: 'Yu-Gi-Oh! Tournament next week', ns_date: '2026-05-03' },
    { ns_id: '3', ns_content: 'Special Discount on Magic The Gathering', ns_date: '2026-05-02' },
  ];
}

async function getCards(): Promise<PostCard[]> {
  // Simulating API call
  return Array.from({ length: 12 }).map((_, i) => ({
    pc_id: `CARD_${i}`,
    pc_name: `Rare Trading Card ${i + 1}`,
    pc_price: 199.99 + (i * 10),
    pci_path: `https://via.placeholder.com/200x350?text=Card+Image+${i + 1}`
  }));
}

export default async function Home() {
  const newsList = await getNews();
  const cardsList = await getCards();

  return (
    <div className="space-y-12">
      {/* Upper Area: News Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Latest News</h2>
        <div className="flex flex-wrap gap-2">
          {newsList.map((news) => (
            <div 
              key={news.ns_id} 
              className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition cursor-pointer"
            >
              {news.ns_date} - {news.ns_content}
            </div>
          ))}
        </div>
      </section>

      {/* Below Area: Waterfall Flow Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Trending Cards</h2>
        {/* Waterfall / Masonry grid approximation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {cardsList.map((card) => (
            <div key={card.pc_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full relative">
              <Link href={`/card/${card.pc_id}`} className="flex flex-col flex-grow group">
                <div className="relative w-full" style={{ aspectRatio: '200/350' }}>
                  <Image
                    src={card.pci_path}
                    alt={card.pc_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 flex-grow group-hover:text-blue-600 transition-colors">
                    {card.pc_name}
                  </h3>
                </div>
              </Link>
              <div className="p-4 pt-0 flex items-center justify-between mt-auto">
                <span className="text-lg font-bold text-red-600">
                  ${card.pc_price.toFixed(2)}
                </span>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition relative z-10">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}