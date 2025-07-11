import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Eye, Download } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GammaPitchData {
  businessName: string;
  industry: string;
  country: string;
  businessType: string;
  description: string;
  fundingAmount: number;
  useCase: string;
}

interface GammaPitchResult {
  success: boolean;
  pitch: {
    title: string;
    subtitle: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      style: string;
    };
    slides: Array<{
      slideNumber: number;
      title: string;
      subtitle?: string;
      content: string[];
      layout: string;
    }>;
    insights: {
      marketSize: string;
      revenueProjection: string;
      competitiveAdvantage: string;
      marketStrategy: string;
    };
  };
  html_content: string;
  design_quality: string;
  metadata: {
    confidence_score: number;
    slide_count: number;
    theme: string;
    processing_tier: string;
  };
}

export default function GammaPitchDemo() {
  const [formData, setFormData] = useState<GammaPitchData>({
    businessName: '',
    industry: 'AgTech',
    country: 'Kenya',
    businessType: 'startup',
    description: '',
    fundingAmount: 500000,
    useCase: 'Series A funding'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GammaPitchResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const industries = [
    'AgTech', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 
    'Logistics', 'E-commerce', 'AI/ML', 'Blockchain', 'IoT'
  ];

  const countries = [
    'Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Rwanda',
    'Uganda', 'Tanzania', 'Botswana', 'Zambia', 'Ethiopia'
  ];

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide business name and description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/intelligence/generate-gamma-pitch', {
        user_id: 'demo_user_gamma',
        website_url: `https://example-${formData.industry.toLowerCase()}.com`,
        uploaded_docs: [],
        baseData: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        toast({
          title: "Gamma-Quality Pitch Generated",
          description: `Created ${data.metadata.slide_count} slides with ${(data.metadata.confidence_score * 100).toFixed(1)}% confidence`,
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Gamma pitch generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate pitch',
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadHTML = () => {
    if (!result?.html_content) return;
    
    const blob = new Blob([result.html_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.businessName.replace(/\s+/g, '-')}-gamma-pitch.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            Gamma-Quality Pitch Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate investor-ready pitch decks with professional design standards matching industry leaders like Gamma app
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Business Information
              </CardTitle>
              <CardDescription>
                Provide your startup details to generate a professional pitch deck
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="Enter your business name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fundingAmount">Funding Amount ($)</Label>
                  <Input
                    id="fundingAmount"
                    type="number"
                    value={formData.fundingAmount}
                    onChange={(e) => setFormData({...formData, fundingAmount: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your business solution and value proposition"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="useCase">Use Case</Label>
                <Select value={formData.useCase} onValueChange={(value) => setFormData({...formData, useCase: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select use case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Series A funding">Series A funding</SelectItem>
                    <SelectItem value="Series B funding">Series B funding</SelectItem>
                    <SelectItem value="Seed funding">Seed funding</SelectItem>
                    <SelectItem value="Pre-seed funding">Pre-seed funding</SelectItem>
                    <SelectItem value="Growth funding">Growth funding</SelectItem>
                    <SelectItem value="Strategic partnership">Strategic partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Gamma-Quality Pitch...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Professional Pitch
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    Generated Pitch Deck
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {result.design_quality}
                    </Badge>
                    <Badge variant="outline">
                      {result.metadata.slide_count} slides
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Confidence: {(result.metadata.confidence_score * 100).toFixed(1)}% | 
                  Theme: {result.pitch.theme.style} | 
                  Tier: {result.metadata.processing_tier}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Market Size</h3>
                      <p className="text-sm text-gray-600">{result.pitch.insights.marketSize}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Revenue Projection</h3>
                      <p className="text-sm text-gray-600">{result.pitch.insights.revenueProjection}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Competitive Advantage</h3>
                      <p className="text-sm text-gray-600">{result.pitch.insights.competitiveAdvantage}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Market Strategy</h3>
                      <p className="text-sm text-gray-600">{result.pitch.insights.marketStrategy}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowPreview(!showPreview)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                    <Button 
                      onClick={downloadHTML}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download HTML
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* HTML Preview */}
        {result && showPreview && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Interactive preview of your Gamma-quality pitch deck
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={result.html_content}
                  className="w-full h-96"
                  title="Pitch Deck Preview"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}