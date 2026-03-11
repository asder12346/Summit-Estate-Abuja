import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
            alt="Luxury Real Estate" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
          >
            Own Verified Land in <br />
            <span className="text-gold-400">Abuja With Confidence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Premium real estate investment opportunities for first-time buyers, investors, and Nigerians in the diaspora.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/properties" className="w-full sm:w-auto px-8 py-4 bg-gold-400 hover:bg-gold-500 text-ink-900 font-semibold rounded-full transition-all flex items-center justify-center space-x-2">
              <span>View Properties</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-full transition-all border border-white/20"
            >
              Talk to AI Advisor
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-gold-400/10 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-gold-400" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Verified Land</h3>
              <p className="text-gray-400">All our properties come with proper documentation (C of O, R of O) to ensure your investment is secure.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-gold-400/10 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-gold-400" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">High Appreciation</h3>
              <p className="text-gray-400">Strategically located in fast-developing areas of Abuja for maximum return on investment.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-gold-400/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-gold-400" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-4">Flexible Payments</h3>
              <p className="text-gray-400">Spread your payments over 6 to 24 months with our convenient payment plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Preview */}
      <section className="py-24 bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Properties</h2>
              <p className="text-gray-400">Discover our most sought-after locations in Abuja.</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center text-gold-400 hover:text-gold-500 font-medium">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-ink-800 rounded-2xl overflow-hidden border border-white/5 group hover:border-gold-400/30 transition-colors">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&sig=${i}`}
                    alt="Property" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-ink-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gold-400 border border-gold-400/20">
                    Available
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-2">Summit Heights Estate</h3>
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    Lugbe, Abuja
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Starting from</p>
                      <p className="text-lg font-semibold text-gold-400">₦15,000,000</p>
                    </div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
