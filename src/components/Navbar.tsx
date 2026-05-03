"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Globe, User } from 'lucide-react';
import AuthModal from './AuthModal';
import logoImg from '@/image/logo.png';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState('EN');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'EN' ? 'ZH' : 'EN');
    // Implement language context/store update here
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm h-[70px] md:h-[140px] flex flex-col justify-center">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src={logoImg} 
              alt="HK Card King Logo" 
              width={80} 
              height={80} 
              className="w-12 h-12 md:w-20 md:h-20 object-contain"
              priority
            />
            <span className="hidden lg:block text-xl md:text-2xl font-bold text-blue-600">
              HK Card King
            </span>
          </Link>
        </div>

        {/* Search Bar - hidden on very small screens, visible on md */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search cards..."
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button onClick={toggleLanguage} className="flex items-center text-gray-600 hover:text-blue-600">
            <Globe size={20} className="mr-1" />
            <span className="hidden md:inline">{lang === 'EN' ? 'English' : '中文'}</span>
          </button>
          
          <button onClick={() => setIsAuthOpen(true)} className="flex items-center text-gray-600 hover:text-blue-600">
            <User size={20} className="mr-1" />
            <span className="hidden md:inline">Register / Login</span>
          </button>

          <Link href="/cart" className="flex items-center text-gray-600 hover:text-blue-600 relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Search - visible only on small screens */}
      <div className="md:hidden px-4 pb-2">
        <form onSubmit={handleSearch} className="w-full relative">
          <input
            type="text"
            placeholder="Search cards..."
            className="w-full px-4 py-1 border rounded-full text-sm focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}