import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Sprout, 
  Building2, 
  Heart, 
  Zap, 
  Laptop, 
  GraduationCap,
  Search,
  Filter,
  Star,
  TrendingUp
} from 'lucide-react';

interface IndustryCategory {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  popularIn: string[];
  documents: string[];
  successRate: string;
  averageFunding: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'pitch_deck' | 'business_plan' | 'resume' | 'proposal';
  industry: string;
  description: string;
  successRate: number;
  averageFunding?: string;
  tier: 'free' | 'premium';
  popular: boolean;
}

export default function IndustryFilter() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);

  const industries: IndustryCategory[] = [
    {
      id: 'agtech',
      name: 'AgriTech',
      icon: <Sprout className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700',
      popularIn: ['Kenya', 'Nigeria', 'Ghana'],
      documents: ['Pitch Deck', 'Grant Proposals', 'Business Plan'],
      successRate: '78%',
      averageFunding: '$125K'
    },
    {
      id: 'fintech',
      name: 'FinTech',
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700',
      popularIn: ['Nigeria', 'South Africa', 'Kenya'],
      documents: ['Pitch Deck', 'Business Plan', 'Compliance Docs'],
      successRate: '82%',
      averageFunding: '$250K'
    },
    {
      id: 'healthtech',
      name: 'HealthTech',
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-red-100 text-red-700',
      popularIn: ['South Africa', 'Rwanda', 'Uganda'],
      documents: ['Pitch Deck', 'Grant Proposals', 'Research Plans'],
      successRate: '71%',
      averageFunding: '$180K'
    },
    {
      id: 'cleantech',
      name: 'CleanTech',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-700',
      popularIn: ['Morocco', 'Egypt', 'Kenya'],
      documents: ['Pitch Deck', 'Environmental Reports', 'Grant Proposals'],
      successRate: '85%',
      averageFunding: '$300K'
    },
    {
      id: 'edtech',
      name: 'EdTech',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700',
      popularIn: ['Nigeria', 'Ghana', 'Tanzania'],
      documents: ['Pitch Deck', 'Business Plan', 'Impact Reports'],
      successRate: '68%',
      averageFunding: '$95K'
    },
    {
      id: 'general',
      name: 'General Tech',
      icon: <Laptop className="w-5 h-5" />,
      color: 'bg-gray-100 text-gray-700',
      popularIn: ['All Countries'],
      documents: ['Pitch Deck', 'Business Plan', 'Technical Docs'],
      successRate: '65%',
      averageFunding: '$150K'
    }
  ];

  const documentTemplates: DocumentTemplate[] = [
    {
      id: 'agtech_pitch',
      name: 'Smart Irrigation Pitch',
      type: 'pitch_deck',
      industry: 'agtech',
      description: 'Perfect for water-efficient farming solutions',
      successRate: 89,
      averageFunding: '$125K',
      tier: 'free',
      popular: true
    },
    {
      id: 'fintech_plan',
      name: 'Mobile Banking Business Plan',
      type: 'business_plan',
      industry: 'fintech',
      description: 'Comprehensive plan for digital payment platforms',
      successRate: 85,
      averageFunding: '$250K',
      tier: 'premium',
      popular: true
    },
    {
      id: 'healthtech_pitch',
      name: 'Telemedicine Platform Pitch',
      type: 'pitch_deck',
      industry: 'healthtech',
      description: 'Healthcare delivery in rural areas',
      successRate: 76,
      averageFunding: '$180K',
      tier: 'free',
      popular: false
    },
    {
      id: 'cleantech_proposal',
      name: 'Solar Energy Grant Proposal',
      type: 'proposal',
      industry: 'cleantech',
      description: 'AfDB and Green Climate Fund focused',
      successRate: 92,
      averageFunding: '$300K',
      tier: 'premium',
      popular: true
    },
    {
      id: 'edtech_pitch',
      name: 'Digital Learning Platform',
      type: 'pitch_deck',
      industry: 'edtech',
      description: 'Educational technology for African schools',
      successRate: 72,
      averageFunding: '$95K',
      tier: 'free',
      popular: false
    },
    {
      id: 'general_resume',
      name: 'Tech Professional CV',
      type: 'resume',
      industry: 'general',
      description: 'ATS-optimized for African job markets',
      successRate: 88,
      tier: 'free',
      popular: true
    }
  ];

  useEffect(() => {
    let filtered = documentTemplates;

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(template => template.industry === selectedIndustry);
    }

    if (searchTerm) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTemplates(filtered);
  }, [selectedIndustry, searchTerm]);

  const handleTemplateSelect = (template: DocumentTemplate) => {
    const route = template.type === 'pitch_deck' ? '/gamma-demo' : '/documents';
    window.location.href = `${route}?template=${template.id}&industry=${template.industry}`;
  };

  const trackFeatureDiscovery = (industry: string, templateName: string) => {
    // Analytics tracking for feature discovery
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'feature_discover', {
        event_category: 'Industry Filter',
        event_label: `${industry}: ${templateName}`,
        value: 1
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedIndustry('all');
            setSearchTerm('');
          }}
        >
          <Filter className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Industry Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setSelectedIndustry('all')}
          className={`p-3 rounded-lg border text-center transition-all ${
            selectedIndustry === 'all' 
              ? 'border-green-600 bg-green-50 text-green-700' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center mb-2">
            <Filter className="w-5 h-5" />
          </div>
          <div className="text-sm font-medium">All Industries</div>
        </button>

        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => setSelectedIndustry(industry.id)}
            className={`p-3 rounded-lg border text-center transition-all ${
              selectedIndustry === industry.id 
                ? 'border-green-600 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`flex items-center justify-center mb-2 p-2 rounded-lg ${industry.color}`}>
              {industry.icon}
            </div>
            <div className="text-sm font-medium">{industry.name}</div>
            <div className="text-xs text-slate-500">{industry.successRate} success</div>
          </button>
        ))}
      </div>

      {/* Selected Industry Details */}
      {selectedIndustry !== 'all' && (
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-4">
            {(() => {
              const industry = industries.find(i => i.id === selectedIndustry);
              if (!industry) return null;
              
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${industry.color}`}>
                      {industry.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{industry.name} Solutions</h3>
                      <p className="text-slate-600">
                        Popular in: {industry.popularIn.join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">{industry.successRate}</span>
                    </div>
                    <div className="text-sm text-slate-600">Avg: {industry.averageFunding}</div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Template Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-green-200"
            onClick={() => {
              trackFeatureDiscovery(template.industry, template.name);
              handleTemplateSelect(template);
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{template.name}</span>
                <div className="flex items-center space-x-1">
                  {template.popular && (
                    <Badge variant="default" className="bg-orange-600 text-xs">
                      Popular
                    </Badge>
                  )}
                  {template.tier === 'premium' && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-slate-600 text-sm">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">
                    {template.successRate}% success rate
                  </span>
                </div>
                {template.averageFunding && (
                  <span className="text-sm text-slate-500">
                    Avg: {template.averageFunding}
                  </span>
                )}
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="border-2 border-dashed border-gray-200">
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or selecting a different industry
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedIndustry('all');
                setSearchTerm('');
              }}
            >
              View All Templates
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}