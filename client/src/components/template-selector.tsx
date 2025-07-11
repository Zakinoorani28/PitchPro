import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Eye, Download, Palette, Star, Zap } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'resume' | 'business_plan';
  tier: 'free' | 'premium';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: string;
  features: string[];
}

const FREE_TEMPLATES: Template[] = [
  {
    id: 'modern_minimal',
    name: 'Modern Minimal',
    category: 'resume',
    tier: 'free',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    colors: { primary: '#2563eb', secondary: '#64748b', accent: '#0f172a' },
    layout: 'single_column',
    features: ['Clean Design', 'ATS Optimized', 'Professional Layout']
  },
  {
    id: 'tech_startup',
    name: 'Tech Startup',
    category: 'resume',
    tier: 'free',
    preview: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
    colors: { primary: '#7c3aed', secondary: '#6b7280', accent: '#111827' },
    layout: 'two_column',
    features: ['Tech-Focused', 'Skills Grid', 'Modern Typography']
  },
  {
    id: 'creative_pro',
    name: 'Creative Professional',
    category: 'resume',
    tier: 'free',
    preview: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    colors: { primary: '#059669', secondary: '#6b7280', accent: '#1f2937' },
    layout: 'creative_grid',
    features: ['Creative Layout', 'Portfolio Section', 'Visual Appeal']
  },
  {
    id: 'executive_classic',
    name: 'Executive Classic',
    category: 'resume',
    tier: 'free',
    preview: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    colors: { primary: '#dc2626', secondary: '#6b7280', accent: '#374151' },
    layout: 'traditional',
    features: ['Executive Style', 'Traditional Format', 'Conservative Design']
  },
  {
    id: 'african_heritage',
    name: 'African Heritage',
    category: 'resume',
    tier: 'free',
    preview: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    colors: { primary: '#f59e0b', secondary: '#8b5cf6', accent: '#065f46' },
    layout: 'cultural_modern',
    features: ['Cultural Design', 'Vibrant Colors', 'Modern African Style']
  }
];

const PREMIUM_TEMPLATES: Template[] = [
  {
    id: 'silicon_valley',
    name: 'Silicon Valley Pro',
    category: 'resume',
    tier: 'premium',
    preview: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    colors: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#1e293b' },
    layout: 'tech_modern',
    features: ['Tech Industry', 'Advanced Layout', 'Premium Design', 'Interactive Elements']
  },
  {
    id: 'investment_banker',
    name: 'Investment Banking',
    category: 'resume',
    tier: 'premium',
    preview: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
    colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#f59e0b' },
    layout: 'finance_executive',
    features: ['Finance Focused', 'Executive Style', 'Quantitative Focus', 'Premium Fonts']
  },
  {
    id: 'venture_capital',
    name: 'Venture Capital',
    category: 'business_plan',
    tier: 'premium',
    preview: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
    colors: { primary: '#1e40af', secondary: '#3730a3', accent: '#0ea5e9' },
    layout: 'investor_focused',
    features: ['Investor Ready', 'Financial Charts', 'Market Analysis', 'Risk Assessment']
  },
  {
    id: 'african_unicorn',
    name: 'African Unicorn',
    category: 'business_plan',
    tier: 'premium',
    preview: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    colors: { primary: '#16a34a', secondary: '#ca8a04', accent: '#dc2626' },
    layout: 'startup_showcase',
    features: ['Africa-Focused', 'Startup Ready', 'Growth Metrics', 'Market Localization']
  },
  {
    id: 'fintech_disruptor',
    name: 'FinTech Disruptor',
    category: 'business_plan',
    tier: 'premium',
    preview: 'linear-gradient(135deg, #7c2d12 0%, #059669 100%)',
    colors: { primary: '#7c2d12', secondary: '#059669', accent: '#0369a1' },
    layout: 'tech_financial',
    features: ['FinTech Focus', 'Technology Stack', 'Regulatory Compliance', 'Revenue Models']
  }
];

interface TemplateSelectorProps {
  category: 'resume' | 'business_plan';
  onSelect: (templateId: string) => void;
  userTier: 'free' | 'premium';
}

export default function TemplateSelector({ category, onSelect, userTier }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const freeTemplates = FREE_TEMPLATES.filter(t => t.category === category);
  const premiumTemplates = PREMIUM_TEMPLATES.filter(t => t.category === category);
  const availableTemplates = userTier === 'premium' ? [...freeTemplates, ...premiumTemplates] : freeTemplates;

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onSelect(templateId);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Choose Your {category === 'resume' ? 'Resume' : 'Business Plan'} Template
        </h3>
        <p className="text-slate-600">
          Professional templates designed for modern {category === 'resume' ? 'job applications' : 'business presentations'}
        </p>
      </div>

      <Tabs defaultValue="free" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="free">
            Free Templates ({freeTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="premium">
            <Crown className="w-4 h-4 mr-2" />
            Premium Templates ({premiumTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="free" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="w-full h-32 rounded-lg mb-4"
                    style={{ background: template.preview }}
                  />
                  <div className="space-y-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-600">
                        <Star className="w-3 h-3 mr-2 text-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template.id);
                      }}
                    >
                      <Palette className="w-4 h-4 mr-1" />
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="premium" className="mt-6">
          {userTier === 'free' && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <Crown className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <h4 className="text-lg font-semibold text-purple-900">Upgrade to Premium</h4>
                  <p className="text-purple-700">Access 15+ professional templates designed by industry experts</p>
                </div>
                <Button className="ml-auto bg-purple-600 hover:bg-purple-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-2 ring-purple-500' : ''
                } ${userTier === 'free' ? 'opacity-75' : ''}`}
                onClick={() => userTier === 'premium' && handleSelectTemplate(template.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="default" className="bg-purple-600">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="w-full h-32 rounded-lg mb-4 relative"
                    style={{ background: template.preview }}
                  >
                    {userTier === 'free' && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-600">
                        <Star className="w-3 h-3 mr-2 text-purple-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={userTier === 'free'}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      disabled={userTier === 'free'}
                      onClick={(e) => {
                        e.stopPropagation();
                        userTier === 'premium' && handleSelectTemplate(template.id);
                      }}
                    >
                      <Palette className="w-4 h-4 mr-1" />
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-green-800 font-medium">
              Template selected: {availableTemplates.find(t => t.id === selectedTemplate)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}