import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Menu, X, CreditCard, Smartphone } from 'lucide-react';

export default function OptimizedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'zu', name: 'isiZulu', flag: '🇿🇦' }
  ];

  const handleMpesaPayment = () => {
    // M-Pesa integration would go here
    window.open('/payment/mpesa', '_blank');
  };

  const handleFlutterwavePayment = () => {
    // Flutterwave integration for other African countries
    window.open('/payment/flutterwave', '_blank');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ProtoLab</h1>
              <p className="text-xs text-slate-500">Africa's AI Document Studio</p>
            </div>
          </div>

          {/* Desktop Navigation - Moved to avoid banner overlay */}
          <nav className="hidden md:flex items-center space-x-6 ml-auto mr-4">
            <a href="/documents" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-md">
              <span>📄</span>
              Document Intelligence
            </a>
            <a href="/admin" className="text-slate-600 hover:text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-md">
              Analytics
            </a>
            <a href="/3d-video" className="text-slate-600 hover:text-slate-900 font-medium bg-slate-50 px-3 py-2 rounded-md">
              3D Videos
            </a>
          </nav>

          {/* Language Selector & Payment Options */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32 h-9">
                <SelectValue>
                  <div className="flex items-center space-x-2">
                    <span>{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                    <span className="text-sm">{languages.find(l => l.code === selectedLanguage)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Payment Options */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMpesaPayment}
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 font-semibold"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                M-Pesa
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlutterwavePayment}
                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <nav className="space-y-3">
              <a 
                href="/documents" 
                className="block text-slate-600 hover:text-slate-900 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Documents
              </a>
              <a 
                href="/admin" 
                className="block text-slate-600 hover:text-slate-900 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </a>
              <a 
                href="/3d-video" 
                className="block text-slate-600 hover:text-slate-900 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                3D Videos
              </a>
            </nav>
            
            {/* Mobile Payment Options */}
            <div className="flex flex-col space-y-2 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMpesaPayment}
                className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 font-semibold w-full"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Pay with M-Pesa
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlutterwavePayment}
                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Pay with Card
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Single Navigation Bar - No Duplicates */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/documents" className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-200 rounded-xl text-slate-700 hover:text-blue-600 hover:border-blue-300 font-semibold shadow-md transition-all hover:shadow-lg hover:scale-105">
              <span className="text-lg">📄</span>
              Document Intelligence
            </a>
            <a href="/admin" className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-green-200 rounded-xl text-slate-700 hover:text-green-600 hover:border-green-300 font-semibold shadow-md transition-all hover:shadow-lg hover:scale-105">
              <span className="text-lg">📊</span>
              Analytics Dashboard
            </a>
            <a href="/3d-video" className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-purple-200 rounded-xl text-slate-700 hover:text-purple-600 hover:border-purple-300 font-semibold shadow-md transition-all hover:shadow-lg hover:scale-105">
              <span className="text-lg">🎬</span>
              3D Video Generator
            </a>
            <a href="/hackathon" className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-yellow-200 rounded-xl text-slate-700 hover:text-yellow-600 hover:border-yellow-300 font-semibold shadow-md transition-all hover:shadow-lg hover:scale-105">
              <span className="text-lg">👑</span>
              Hackathon Perks
            </a>
            <Button
              variant="outline"
              size="lg"
              onClick={handleMpesaPayment}
              className="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-yellow-400 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 px-5 py-3"
            >
              <Smartphone className="w-5 h-5 mr-2" />
              M-Pesa Payment
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleFlutterwavePayment}
              className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-500 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 px-5 py-3"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Card Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Connection Status Bar for Low-Speed Networks */}
      <div id="connection-status" className="hidden bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <div className="flex items-center justify-center text-sm text-yellow-800">
          <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 animate-pulse"></div>
          Optimizing for your connection speed...
        </div>
      </div>

      {/* Network Detection Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('connection' in navigator) {
              const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
              if (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
                document.getElementById('connection-status')?.classList.remove('hidden');
                document.body.classList.add('low-connection');
              }
            }
          `
        }}
      />
    </header>
  );
}