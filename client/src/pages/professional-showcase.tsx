import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, Users, Globe, Award, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ShowcaseData {
  businessName: string;
  industry: string;
  country: string;
  description: string;
  fundingAmount: number;
  useCase: string;
}

interface PitchResult {
  success: boolean;
  pitch: {
    title: string;
    subtitle: string;
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
  metadata: {
    confidence_score: number;
    slide_count: number;
    processing_tier: string;
  };
}

const showcaseExamples: ShowcaseData[] = [
  {
    businessName: "AgriTech Innovation Hub",
    industry: "AgTech",
    country: "Kenya",
    description: "AI-powered precision agriculture platform using satellite imagery and IoT sensors to optimize crop yields for smallholder farmers",
    fundingAmount: 1500000,
    useCase: "Series A funding"
  },
  {
    businessName: "HealthTech Africa",
    industry: "HealthTech", 
    country: "Nigeria",
    description: "Telemedicine platform connecting rural communities with specialist doctors using AI-assisted diagnosis and mobile health records",
    fundingAmount: 3000000,
    useCase: "Series B funding"
  },
  {
    businessName: "EduTech Solutions",
    industry: "EdTech",
    country: "South Africa", 
    description: "Personalized learning platform using adaptive AI to deliver quality education content in local languages across Africa",
    fundingAmount: 800000,
    useCase: "Seed funding"
  }
];

export default function ProfessionalShowcase() {
  const [selectedExample, setSelectedExample] = useState<ShowcaseData>(showcaseExamples[0]);
  const [results, setResults] = useState<{ [key: string]: PitchResult }>({});
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progressive loading for demonstration
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 100;
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const generatePitch = async (example: ShowcaseData) => {
    const key = example.businessName;
    setIsGenerating(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await apiRequest('POST', '/api/intelligence/generate-gamma-pitch', {
        user_id: `showcase_${key.toLowerCase().replace(/\s+/g, '_')}`,
        website_url: `https://example-${example.industry.toLowerCase()}.com`,
        uploaded_docs: [],
        baseData: example
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(prev => ({ ...prev, [key]: data }));
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(prev => ({ ...prev, [key]: false }));
    }
  };

  const downloadHTML = (result: PitchResult, name: string) => {
    const blob = new Blob([result.html_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-')}-professional-pitch.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-indigo-600" />
                Professional Pitch Showcase
              </h1>
              <p className="text-gray-600 mt-2">High-quality investor presentations competing with industry leaders</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Award className="h-4 w-4 mr-1" />
                Enterprise Grade
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                96% Confidence
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">96%</div>
              <Progress value={progress} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Slide Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-sm text-gray-500 mt-1">Professional structure</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Processing Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Premium</div>
              <p className="text-sm text-gray-500 mt-1">Enterprise features</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Industries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">10+</div>
              <p className="text-sm text-gray-500 mt-1">Sector coverage</p>
            </CardContent>
          </Card>
        </div>

        {/* Showcase Examples */}
        <Tabs defaultValue="examples" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="examples">Live Examples</TabsTrigger>
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="results">Generated Results</TabsTrigger>
          </TabsList>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {showcaseExamples.map((example, index) => (
                <Card key={example.businessName} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {example.businessName}
                      <Badge variant="outline">{example.industry}</Badge>
                    </CardTitle>
                    <CardDescription>{example.country} • ${example.fundingAmount.toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{example.description}</p>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => generatePitch(example)}
                        disabled={isGenerating[example.businessName]}
                        className="w-full"
                        variant={results[example.businessName] ? "outline" : "default"}
                      >
                        {isGenerating[example.businessName] ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : results[example.businessName] ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Generated
                          </>
                        ) : (
                          <>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Generate Pitch
                          </>
                        )}
                      </Button>
                      
                      {results[example.businessName] && (
                        <Button
                          onClick={() => downloadHTML(results[example.businessName], example.businessName)}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Download HTML
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Professional Design System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Industry-specific color themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Modern typography system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Responsive layouts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Professional animations</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Content Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Context-aware generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Industry-specific insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Financial projections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Market analysis</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    African Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Local market insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Cultural considerations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Regional partnerships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Cross-border scaling</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">HTML export capability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Brand customization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-format support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Collaboration tools</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {Object.entries(results).length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Yet</h3>
                  <p className="text-gray-600">Generate a pitch from the examples tab to see results here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(results).map(([name, result]) => (
                  <Card key={name}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {name}
                        <Badge variant="secondary">
                          {(result.metadata.confidence_score * 100).toFixed(1)}% confidence
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {result.metadata.slide_count} slides • {result.metadata.processing_tier} tier
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Market Size</h4>
                          <p className="text-sm text-gray-600">{result.pitch.insights.marketSize}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Revenue Projection</h4>
                          <p className="text-sm text-gray-600">{result.pitch.insights.revenueProjection}</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => downloadHTML(result, name)}
                        className="w-full"
                      >
                        Download Professional Presentation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}