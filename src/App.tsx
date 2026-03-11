import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Building2, Calculator, Users, Phone, MessageSquare, Mic } from 'lucide-react';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import InvestmentPage from './pages/InvestmentPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AIChatbot from './components/AIChatbot';
import AIVoiceReceptionist from './components/AIVoiceReceptionist';

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-ink-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-gold-400" />
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              SUMMIT<span className="text-gold-400">ESTATE</span>
            </span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-widest">Home</Link>
            <Link to="/properties" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-widest">Properties</Link>
            <Link to="/investment" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-widest">Investment</Link>
            <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-widest">About</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-widest">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-2 bg-gold-400 hover:bg-gold-500 text-ink-900 px-6 py-2.5 rounded-full font-medium transition-colors">
              <span>Book Inspection</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-ink-800 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Building2 className="h-6 w-6 text-gold-400" />
              <span className="font-serif text-xl font-bold text-white">SUMMIT<span className="text-gold-400">ESTATE</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium real estate and verified land investment opportunities in Abuja, Nigeria. Own your future with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/properties" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Property Listings</Link></li>
              <li><Link to="/investment" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Investment Calculator</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">Documentation Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">123 Maitama District, Abuja, Nigeria</li>
              <li className="text-gray-400 text-sm">+234 800 SUMMIT</li>
              <li className="text-gray-400 text-sm">invest@summitestate.ng</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2026 Summit Estate Nigeria. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-ink-900 text-white font-sans selection:bg-gold-400/30">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/investment" element={<InvestmentPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <AIChatbot />
        <AIVoiceReceptionist />
      </div>
    </Router>
  );
}
