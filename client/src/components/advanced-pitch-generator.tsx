import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, Link, Wand2, Star, Video, Image, FileSpreadsheet } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';

interface PitchGenerationData {
  businessIdea: string;
  industry: string;
  target: string;
  fundingAmount: string;
  stage: string;
  teamSize: string;
  websiteUrl?: string;
  supportingDocuments?: File[];
  additionalContext?: string;
}

export default function AdvancedPitchGenerator() {
  const [pitchData, setPitchData] = useState<PitchGenerationData>({
    businessIdea: '',
    industry: '',
    target: '',
    fundingAmount: '',
    stage: '',
    teamSize: '',
    websiteUrl: '',
    additionalContext: ''
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedPitch, setGeneratedPitch] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState('html');
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    toast({
      title: "Files uploaded successfully",
      description: `${acceptedFiles.length} file(s) added for analysis`,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 5
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generatePitch = async () => {
    if (!pitchData.businessIdea || !pitchData.industry) {
      toast({
        title: "Missing Information",
        description: "Please provide at least business idea and industry",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const formData = new FormData();
      formData.append('businessIdea', pitchData.businessIdea);
      formData.append('industry', pitchData.industry);
      formData.append('target', pitchData.target);
      formData.append('fundingAmount', pitchData.fundingAmount);
      formData.append('stage', pitchData.stage);
      formData.append('teamSize', pitchData.teamSize);
      
      if (pitchData.websiteUrl) {
        formData.append('websiteUrl', pitchData.websiteUrl);
      }
      
      if (pitchData.additionalContext) {
        formData.append('additionalContext', pitchData.additionalContext);
      }

      // Add uploaded files
      uploadedFiles.forEach((file, index) => {
        formData.append(`supportingDocument_${index}`, file);
      });

      const response = await apiRequest('POST', '/api/intelligence/generate-enhanced-pitch', formData);
      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      setGeneratedPitch(data);

      toast({
        title: "Pitch Generated Successfully!",
        description: "Your AI-powered pitch deck is ready for download",
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate pitch. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPitch = async (format: string) => {
    if (!generatedPitch) return;

    try {
      const response = await apiRequest('POST', '/api/intelligence/export-pitch', {
        pitchId: generatedPitch.id,
        format: format
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pitchData.businessIdea.replace(/\s+/g, '-')}-pitch.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `Your pitch deck is downloading as ${format.toUpperCase()}`,
      });

    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to export pitch. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-blue-600" />
            AI-Powered Pitch Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Supporting Documents Upload */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Supporting Documents & Context</Label>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-1">Drag & drop files here, or click to select</p>
                  <p className="text-sm text-gray-400">
                    Supports: PDF, DOCX, PPTX, TXT, Images, Excel (Max 5 files)
                  </p>
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Files:</Label>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {file.name}
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website URL (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://your-company.com"
                  value={pitchData.websiteUrl}
                  onChange={(e) => setPitchData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="context">Additional Context</Label>
                <Input
                  id="context"
                  placeholder="Key achievements, partnerships, etc."
                  value={pitchData.additionalContext}
                  onChange={(e) => setPitchData(prev => ({ ...prev, additionalContext: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Core Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessIdea">Business Idea *</Label>
              <Textarea
                id="businessIdea"
                placeholder="Describe your business idea, product, or service..."
                value={pitchData.businessIdea}
                onChange={(e) => setPitchData(prev => ({ ...prev, businessIdea: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select onValueChange={(value) => setPitchData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agtech">AgTech</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthtech">HealthTech</SelectItem>
                    <SelectItem value="edtech">EdTech</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target">Target Audience</Label>
                <Input
                  id="target"
                  placeholder="Who are your customers?"
                  value={pitchData.target}
                  onChange={(e) => setPitchData(prev => ({ ...prev, target: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="funding">Funding Amount</Label>
              <Select onValueChange={(value) => setPitchData(prev => ({ ...prev, fundingAmount: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50000">$50K - Seed</SelectItem>
                  <SelectItem value="250000">$250K - Pre-Series A</SelectItem>
                  <SelectItem value="500000">$500K - Series A</SelectItem>
                  <SelectItem value="1000000">$1M - Series A</SelectItem>
                  <SelectItem value="5000000">$5M - Series B</SelectItem>
                  <SelectItem value="custom">Custom Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stage">Business Stage</Label>
              <Select onValueChange={(value) => setPitchData(prev => ({ ...prev, stage: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea Stage</SelectItem>
                  <SelectItem value="mvp">MVP/Prototype</SelectItem>
                  <SelectItem value="validation">Market Validation</SelectItem>
                  <SelectItem value="growth">Growth Stage</SelectItem>
                  <SelectItem value="scaling">Scaling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="team">Team Size</Label>
              <Select onValueChange={(value) => setPitchData(prev => ({ ...prev, teamSize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Solo Founder</SelectItem>
                  <SelectItem value="2-3">2-3 Co-founders</SelectItem>
                  <SelectItem value="4-10">Small Team (4-10)</SelectItem>
                  <SelectItem value="11-50">Medium Team (11-50)</SelectItem>
                  <SelectItem value="50+">Large Team (50+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating your pitch...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Generate Button */}
          <Button 
            onClick={generatePitch} 
            disabled={isGenerating || !pitchData.businessIdea || !pitchData.industry}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate AI Pitch Deck'}
          </Button>

          {/* Generated Pitch Results */}
          {generatedPitch && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Star className="w-5 h-5" />
                  Pitch Generated Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadPitch('pdf')}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadPitch('pptx')}
                    className="flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    PowerPoint
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadPitch('html')}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    HTML
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadPitch('video')}
                    className="flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </Button>
                </div>
                
                {generatedPitch.preview && (
                  <div className="border rounded-lg p-4 bg-white">
                    <h4 className="font-semibold mb-2">Pitch Preview:</h4>
                    <div dangerouslySetInnerHTML={{ __html: generatedPitch.preview }} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}