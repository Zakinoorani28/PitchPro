import OptimizedHeader from "@/components/optimized-header";
import AccessibleNavigation from "@/components/accessible-navigation";
import HeroImproved from "@/components/hero-improved";
import ProgressWidget from "@/components/progress-widget";
import IndustryFilter from "@/components/industry-filter";
import DemoShowcase from "@/components/demo-showcase";
import PitchGenerator from "@/components/pitch-generator";
import GrantIntelligence from "@/components/grant-intelligence";
import CollaborationWorkspace from "@/components/collaboration-workspace";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <OptimizedHeader />
      <AccessibleNavigation />
      <HeroImproved />
      


      {/* Region-Intelligent Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Region-Intelligent Agents
            </h2>
            <p className="text-lg text-slate-600">
              Our AI automatically adapts to your market context
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 feature-grid">
            <div className="region-card bg-slate-50 p-6 rounded-lg relative overflow-hidden">
              <div className="text-2xl mb-3">🇰🇪</div>
              <h3 className="font-semibold mb-2">M-Pesa & Airtel Money</h3>
              <p className="text-sm text-slate-600">Mobile money integration and local payment methods</p>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-radial from-green-100 to-transparent opacity-50 rounded-full -translate-y-4 translate-x-4"></div>
            </div>
            
            <div className="region-card bg-slate-50 p-6 rounded-lg relative overflow-hidden">
              <div className="text-2xl mb-3">🇪🇺</div>
              <h3 className="font-semibold mb-2">GDPR & EU compliance</h3>
              <p className="text-sm text-slate-600">Data protection and privacy regulations</p>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-radial from-blue-100 to-transparent opacity-50 rounded-full -translate-y-4 translate-x-4"></div>
            </div>
            
            <div className="region-card bg-slate-50 p-6 rounded-lg relative overflow-hidden">
              <div className="text-2xl mb-3">🇺🇸</div>
              <h3 className="font-semibold mb-2">US/Global payment methods</h3>
              <p className="text-sm text-slate-600">Multi-language support and cultural adaptation</p>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-radial from-purple-100 to-transparent opacity-50 rounded-full -translate-y-4 translate-x-4"></div>
            </div>
            
            <div className="region-card bg-slate-50 p-6 rounded-lg relative overflow-hidden">
              <div className="text-2xl mb-3">🌏</div>
              <h3 className="font-semibold mb-2">20+ local templates</h3>
              <p className="text-sm text-slate-600">Region-specific business document formats</p>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-radial from-orange-100 to-transparent opacity-50 rounded-full -translate-y-4 translate-x-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Filter Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Choose Your Industry
            </h2>
            <p className="text-lg text-slate-600">
              Optimized templates for African markets with global expansion ready
            </p>
          </div>
          <IndustryFilter />
        </div>
      </section>

      <DemoShowcase />
      <PitchGenerator />
      <GrantIntelligence />
      <CollaborationWorkspace />
      <Pricing />
      <Footer />
    </div>
  );
}
