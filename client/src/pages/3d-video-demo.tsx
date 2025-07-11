import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, Download, Zap, Eye, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Video3DData {
  businessName: string;
  industry: string;
  country: string;
  businessType: string;
  description: string;
  fundingAmount: number;
  useCase: string;
}

interface Video3DResult {
  success: boolean;
  video_pitch: {
    title: string;
    duration: number;
    resolution: {
      width: number;
      height: number;
      fps: number;
    };
    slides: Array<{
      slideNumber: number;
      title: string;
      subtitle?: string;
      content: string[];
      animation: {
        type: string;
        duration: number;
      };
      threeDElements: {
        geometry: string;
        material: string;
        lighting: string;
        environment: string;
      };
    }>;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      style: string;
    };
  };
  html_content: string;
  video_quality: string;
  metadata: {
    confidence_score: number;
    duration: number;
    resolution: string;
    fps: number;
    slide_count: number;
    processing_tier: string;
  };
}

export default function Video3DDemo() {
  const [formData, setFormData] = useState<Video3DData>({
    businessName: '',
    industry: 'AgTech',
    country: 'Kenya',
    businessType: 'startup',
    description: '',
    fundingAmount: 500000,
    useCase: 'Series A funding'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<Video3DResult | null>(null);
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
      const response = await apiRequest('POST', '/api/intelligence/generate-3d-video', {
        user_id: 'demo_user_3d',
        website_url: `https://example-${formData.industry.toLowerCase()}.com`,
        uploaded_docs: [],
        baseData: formData
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        toast({
          title: "3D Video Generated",
          description: `Created ${data.metadata.slide_count} interactive 3D slides in ${data.metadata.duration}s at ${data.metadata.resolution}`,
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      console.error('3D video generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate 3D video',
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
    a.download = `${formData.businessName.replace(/\s+/g, '-')}-3d-video.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openPreview = () => {
    if (!result?.html_content) return;
    
    const blob = new Blob([result.html_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Zap className="h-8 w-8 text-purple-600" />
            3D Interactive Video Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create stunning 3D interactive pitch presentations with Three.js technology and immersive animations
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Play className="h-4 w-4 mr-1" />
              Interactive 3D
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              1080p @ 60fps
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Three.js Powered
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">3D Generator</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="specs">Technical Specs</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Business Configuration
                </CardTitle>
                <CardDescription>
                  Configure your startup details for 3D video generation
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
                    placeholder="Describe your innovative business solution"
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating 3D Video...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Generate 3D Interactive Video
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
                      <Play className="h-5 w-5 text-green-600" />
                      3D Video Generated
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {result.video_quality}
                      </Badge>
                      <Badge variant="outline">
                        {result.metadata.slide_count} slides
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Duration: {result.metadata.duration}s | 
                    Resolution: {result.metadata.resolution} | 
                    FPS: {result.metadata.fps} | 
                    Confidence: {(result.metadata.confidence_score * 100).toFixed(1)}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Theme Style</h3>
                        <p className="text-sm text-gray-600 capitalize">{result.video_pitch.theme.style}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Processing Tier</h3>
                        <p className="text-sm text-gray-600">{result.metadata.processing_tier}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">3D Elements Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.video_pitch.slides.slice(0, 3).map((slide, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {slide.threeDElements.geometry} ({slide.threeDElements.material})
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={openPreview}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Open 3D Preview
                      </Button>
                      <Button 
                        onClick={downloadHTML}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download HTML
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            {result ? (
              <Card>
                <CardHeader>
                  <CardTitle>Interactive 3D Preview</CardTitle>
                  <CardDescription>
                    Full-screen 3D presentation with Three.js animations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden bg-black">
                    <iframe
                      srcDoc={result.html_content}
                      className="w-full h-96"
                      title="3D Video Preview"
                      style={{ minHeight: '600px' }}
                    />
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Use Previous/Next buttons or auto-play to navigate through the 3D presentation
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No 3D Video Generated</h3>
                  <p className="text-gray-600">Generate a 3D video from the Generator tab to see the preview here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="specs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    3D Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">3D Engine:</span>
                    <span className="text-gray-600">Three.js WebGL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Rendering:</span>
                    <span className="text-gray-600">Hardware Accelerated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Animations:</span>
                    <span className="text-gray-600">GPU-based transforms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Lighting:</span>
                    <span className="text-gray-600">Real-time shadows</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Materials:</span>
                    <span className="text-gray-600">PBR shading</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                    Video Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Resolution:</span>
                    <span className="text-gray-600">1920x1080 (Full HD)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Frame Rate:</span>
                    <span className="text-gray-600">60 FPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span className="text-gray-600">30 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Slides:</span>
                    <span className="text-gray-600">6 interactive slides</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Export:</span>
                    <span className="text-gray-600">Interactive HTML</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>3D Animation Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {['3D Rotate', '3D Zoom', '3D Flip', '3D Cube', '3D Spiral'].map((animation) => (
                      <div key={animation} className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg mx-auto mb-2"></div>
                        <p className="text-sm font-medium">{animation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}