export default function InvestmentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-4">Investment Calculator</h1>
      <p className="text-gray-400 mb-12">Calculate your potential returns on Abuja real estate.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-ink-800 p-8 rounded-3xl border border-white/10">
          <h2 className="text-2xl font-serif font-semibold mb-6">Calculate Returns</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Initial Investment (₦)</label>
              <input type="number" defaultValue="15000000" className="w-full bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Investment Period (Years)</label>
              <input type="range" min="1" max="10" defaultValue="5" className="w-full accent-gold-400" />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>1 Year</span>
                <span>5 Years</span>
                <span>10 Years</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Expected Annual Appreciation (%)</label>
              <input type="number" defaultValue="25" className="w-full bg-ink-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold-400" />
            </div>
            <button className="w-full bg-gold-400 hover:bg-gold-500 text-ink-900 py-4 rounded-xl font-bold transition-colors mt-4">
              Calculate Projected Value
            </button>
          </div>
        </div>
        
        <div className="bg-gold-400/10 p-8 rounded-3xl border border-gold-400/20 flex flex-col justify-center">
          <h3 className="text-lg font-medium text-gold-400 mb-2">Projected Value in 5 Years</h3>
          <p className="text-5xl font-serif font-bold text-white mb-4">₦45,776,367</p>
          <div className="space-y-4 mt-8">
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-gray-400">Total Profit</span>
              <span className="font-semibold text-green-400">+₦30,776,367</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-gray-400">ROI</span>
              <span className="font-semibold text-white">205%</span>
            </div>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
            className="mt-8 w-full bg-ink-900 hover:bg-ink-800 text-white border border-white/10 py-4 rounded-xl font-medium transition-colors"
          >
            Ask AI Advisor About This
          </button>
        </div>
      </div>
    </div>
  );
}
