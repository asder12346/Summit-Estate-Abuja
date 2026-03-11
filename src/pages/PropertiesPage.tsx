import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

export default function PropertiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-4">Property Listings</h1>
          <p className="text-gray-400">Find the perfect land for your next investment or home.</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-ink-800 p-4 rounded-2xl border border-white/10 mb-12 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input 
            type="text" 
            placeholder="Search by location or estate name..." 
            className="w-full bg-ink-900 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400 transition-colors appearance-none">
            <option value="">Price Range</option>
            <option value="0-10m">Under ₦10M</option>
            <option value="10m-30m">₦10M - ₦30M</option>
            <option value="30m+">Above ₦30M</option>
          </select>
          <select className="bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400 transition-colors appearance-none">
            <option value="">Location</option>
            <option value="lugbe">Lugbe</option>
            <option value="kuje">Kuje</option>
            <option value="apo">Apo</option>
          </select>
          <button className="bg-gold-400 hover:bg-gold-500 text-ink-900 px-6 py-3 rounded-xl font-medium transition-colors flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-ink-800 rounded-2xl overflow-hidden border border-white/5 group hover:border-gold-400/30 transition-colors">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800&sig=${i}`}
                alt="Property" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-ink-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gold-400 border border-gold-400/20">
                C of O
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-serif font-semibold mb-2">Summit View Estate {i}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                Airport Road, Abuja
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-ink-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Size</p>
                  <p className="font-medium">500 sqm</p>
                </div>
                <div className="bg-ink-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="font-medium">R of O</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div>
                  <p className="text-lg font-semibold text-gold-400">₦25,000,000</p>
                </div>
                <button className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-ink-900 rounded-lg text-sm font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
