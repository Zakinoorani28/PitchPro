import { Sprout, Clock, MapPin, FileText, Shield, Users, User, Building } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Sprout,
      title: "AgriTech Intelligence",
      description: "Specialized in agricultural technology, understanding everything from smallholder farming to large-scale agribusiness opportunities across Africa",
      color: "text-accent bg-accent/10"
    },
    {
      icon: Clock,
      title: "5-Minute Generation",
      description: "From concept to investor-ready presentation in minutes, perfect for the fast-paced African startup ecosystem",
      color: "text-primary bg-primary/10"
    },
    {
      icon: MapPin,
      title: "Global Markets + African Focus",
      description: "Comprehensive market insights with deep African expertise, covering all major economies worldwide",
      color: "text-orange-600 bg-orange-100"
    },
    {
      icon: FileText,
      title: "Professional Presentations",
      description: "Export publication-ready PDFs designed for both local investors and international development funds",
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption protecting your innovative agricultural and technology solutions from idea theft",
      color: "text-red-600 bg-red-100"
    },
    {
      icon: Users,
      title: "Impact-Focused",
      description: "Highlight social impact alongside financial returns - essential for attracting development finance and impact investors",
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: User,
      title: "ATS-Optimized Resumes",
      description: "AI-powered resume builder with industry-specific optimization and LinkedIn integration for African professionals",
      color: "text-indigo-600 bg-indigo-100"
    },
    {
      icon: Building,
      title: "Business Plan Generator",
      description: "Comprehensive business plans with financial projections tailored for African markets and international investors",
      color: "text-teal-600 bg-teal-100"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-savanna">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold font-lora text-slate-900 mb-4">Powered by Global Innovation, Focused on Africa</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Deep expertise in African markets from Lagos to Cape Town, with global best practices. 
            Perfect for entrepreneurs building in Africa or targeting African opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-full mb-4`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-lora text-slate-900 mb-4">Trusted Across Africa</h3>
            <p className="text-slate-600">Empowering entrepreneurs from Cape Town to Cairo with investment-ready presentations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center bg-accent/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-accent mb-1">3,200+</div>
              <div className="text-slate-600 text-sm">AgriTech Pitches</div>
            </div>
            <div className="text-center bg-primary/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-primary mb-1">$85M+</div>
              <div className="text-slate-600 text-sm">Funding Raised</div>
            </div>
            <div className="text-center bg-orange-500/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-orange-600 mb-1">54</div>
              <div className="text-slate-600 text-sm">Countries</div>
            </div>
            <div className="text-center bg-blue-500/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">98%</div>
              <div className="text-slate-600 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
