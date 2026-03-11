import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
      <p className="text-gray-400 mb-12">Get in touch with our real estate experts today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-ink-800 p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-serif font-semibold mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input type="text" className="w-full bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input type="email" className="w-full bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400"></textarea>
            </div>
            <button className="w-full bg-gold-400 hover:bg-gold-500 text-ink-900 py-4 rounded-xl font-bold transition-colors">
              Send Message
            </button>
          </form>
        </div>
        
        <div className="space-y-8">
          <div className="bg-ink-800 p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-serif font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-gold-400 mr-4 mt-1" />
                <div>
                  <p className="font-medium text-white">Office Address</p>
                  <p className="text-gray-400">123 Maitama District, Abuja, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-gold-400 mr-4 mt-1" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="text-gray-400">+234 800 SUMMIT</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-gold-400 mr-4 mt-1" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-gray-400">invest@summitestate.ng</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gold-400/10 p-8 rounded-3xl border border-gold-400/20 text-center">
            <h3 className="text-xl font-serif font-semibold text-gold-400 mb-4">Need Instant Answers?</h3>
            <p className="text-gray-300 mb-6">Our AI Assistant is available 24/7 to answer your property questions.</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
              className="px-8 py-3 bg-ink-900 hover:bg-ink-800 text-white border border-white/10 rounded-full font-medium transition-colors"
            >
              Chat with AI Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
