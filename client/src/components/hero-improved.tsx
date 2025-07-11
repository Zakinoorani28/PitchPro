import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { useRegionDetection } from '@/hooks/use-region-detection';
import { 
  Presentation, 
  FileText, 
  UserCheck, 
  Building2,
  Play,
  Star,
  MapPin,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ServiceCategory {
  name: string;
  services: Array<{
    name: string;
    icon: JSX.Element;
    description: string;
    popular?: boolean;
    successRate?: string;
  }>;
}

export default function HeroImproved() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Startups');
  // const regionInfo = useRegionDetection();

  const serviceCategories: ServiceCategory[] = [
    {
      name: 'Startups',
      services: [
        {
          name: 'Pitch Deck',
          icon: <Presentation className="w-6 h-6" />,
          description: 'Investor-ready presentations',
          popular: true,
          successRate: '89% funding success'
        },
        {
          name: 'Business Plan',
          icon: <Building2 className="w-6 h-6" />,
          description: 'Comprehensive strategy documents',
          successRate: '94% approval rate'
        }
      ]
    },
    {
      name: 'Professionals',
      services: [
        {
          name: 'CV Builder',
          icon: <UserCheck className="w-6 h-6" />,
          description: 'ATS-optimized resumes',
          popular: true,
          successRate: '85% interview rate'
        },
        {
          name: 'Proposals',
          icon: <FileText className="w-6 h-6" />,
          description: 'Winning project proposals',
          successRate: '78% acceptance'
        }
      ]
    }
  ];

  const testimonials = [
    {
      text: "Started using ProtoLab in Nairobi, now deploying same agents globally",
      author: "Tech Team",
      company: "Pan-African Logistics Co",
      flag: "🇰🇪 → 🌍"
    },
    {
      text: "AI automatically adapted our pitch for European investors",
      author: "FinTech Lagos, Nigeria",
      flag: "🇳🇬"
    },
    {
      text: "Same platform, different regions - perfect localization",
      author: "AgriTech Ghana",
      flag: "🇬🇭"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-green-50 py-20 mt-48 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 1,200+ African Entrepreneurs
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 font-lora">
            Build AI Agents That 
            <span className="text-green-600"> Speak Your Region</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            African-born, globally scaling. Create locally-aware AI agents in seconds.
          </p>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            AI-powered pitch decks, business plans, and proposals with authentic African market data, 
            cultural themes, and grant intelligence from AfDB, Green Climate Fund, and more.
          </p>

          {/* Global Auto-Adaptation Pill */}
          <div className="global-pill inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 mb-6">
            <span>🌍</span>
            <span id="region-hint">Optimized for African entrepreneurs</span>
          </div>

          {/* Primary Value Proposition */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Badge variant="secondary" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              54 African Countries
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              12+ Local Languages
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              $2.8B+ Funding Matched
            </Badge>
          </div>
        </div>

        {/* Service Categories with Progressive Disclosure */}
        <div className="max-w-4xl mx-auto">
          {/* Category Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-sm border">
              {serviceCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    selectedCategory === category.name
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  For {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {serviceCategories
              .find(cat => cat.name === selectedCategory)
              ?.services.map((service, index) => (
                <Card key={service.name} className="group hover:shadow-lg transition-all border-2 hover:border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          {service.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-bold">{service.name}</h3>
                            {service.popular && (
                              <Badge variant="default" className="bg-orange-600">
                                Popular in Nigeria
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm">{service.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">
                        {service.successRate}
                      </span>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const route = service.name === 'Pitch Deck' ? '/gamma-demo' :
                                       service.name === 'CV Builder' ? '/documents' :
                                       service.name === 'Business Plan' ? '/documents' : '/documents';
                          window.location.href = route;
                        }}
                      >
                        Create {service.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            }
          </div>

          {/* Single Primary CTA */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.location.href = '/gamma-demo'}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Live Demo
            </Button>
            <p className="text-sm text-slate-500 mt-3">
              See how GreenHarvest Kenya secured $500K from AfDB
            </p>
          </div>
        </div>

        {/* African Success Stories */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              African Success Stories
            </h2>
            <p className="text-lg text-slate-600">
              Real entrepreneurs, real results across Africa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                company: "SolarTech Nigeria",
                amount: "$125K",
                source: "Green Climate Fund",
                industry: "CleanTech",
                flag: "🇳🇬",
                template: "Ubuntu Spirit Theme"
              },
              {
                company: "FarmLink Kenya",
                amount: "$75K",
                source: "African Development Bank",
                industry: "AgriTech",
                flag: "🇰🇪",
                template: "Kente Professional"
              },
              {
                company: "HealthTech Ghana",
                amount: "$200K",
                source: "World Bank IFC",
                industry: "HealthTech",
                flag: "🇬🇭",
                template: "Baobab Modern"
              }
            ].map((story, index) => (
              <Card key={index} className="bg-white border-2 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{story.flag}</div>
                    <Badge variant="outline" className="text-green-600">
                      {story.industry}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{story.company}</h4>
                  <p className="text-green-600 font-bold text-xl mb-1">{story.amount}</p>
                  <p className="text-slate-600 text-sm mb-2">from {story.source}</p>
                  <p className="text-xs text-slate-500">Template: {story.template}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button - Primary CTA */}
      {/* Removed fixed positioned floating button to prevent overlap */}

      {/* Cycle testimonials */}

    </section>
  );
}