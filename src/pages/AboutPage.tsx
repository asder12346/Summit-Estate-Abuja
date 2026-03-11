export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-4">About Summit Estate</h1>
      <p className="text-gray-400 mb-12">Your trusted partner in Abuja real estate.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
            alt="Office" 
            className="rounded-3xl object-cover h-96 w-full"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            To provide Nigerians at home and in the diaspora with secure, verified, and high-yielding real estate investments in the Federal Capital Territory.
          </p>
          <h2 className="text-3xl font-serif font-bold mb-6">Why Choose Us</h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start">
              <span className="text-gold-400 mr-2">✓</span>
              100% Verified Titles (C of O, R of O)
            </li>
            <li className="flex items-start">
              <span className="text-gold-400 mr-2">✓</span>
              Strategic Locations with High ROI
            </li>
            <li className="flex items-start">
              <span className="text-gold-400 mr-2">✓</span>
              Transparent Documentation Process
            </li>
            <li className="flex items-start">
              <span className="text-gold-400 mr-2">✓</span>
              Flexible Payment Plans
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
